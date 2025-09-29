const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("./db");

// Importa SDK nueva de Mercado Pago
const { MercadoPagoConfig, Preference } = require("mercadopago");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = "proyect_2025";
const saltRounds = 10;

// Configura Mercado Pago
const mpClient = new MercadoPagoConfig({
  accessToken:
    "APP_USR-4101729741196338-091313-fdb759422219f5e7976c70f8e19b0782-2690834646",
});

// Middleware para verificar token
function verificarToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Token requerido" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ success: false, message: "Token inválido o expirado" });
    }
    req.user = user;
    next();
  });
}

// Registro
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Todos los campos son requeridos" });
  }

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Error en el servidor" });
    }

    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(sql, [name, email, hash], (err) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res
            .status(400)
            .json({ success: false, message: "Correo ya registrado" });
        }
        return res
          .status(500)
          .json({ success: false, message: "Error al registrar usuario" });
      }
      res.json({ success: true, message: "Usuario registrado correctamente" });
    });
  });
});

// Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email y contraseña son requeridos" });
  }

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Error en el servidor" });
    if (results.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Correo o contraseña incorrectos" });
    }

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Error en el servidor" });
      if (!isMatch)
        return res
          .status(401)
          .json({ success: false, message: "Correo o contraseña incorrectos" });

      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
    });
  });
});

// Crear Reserva
app.post("/reservas", verificarToken, (req, res) => {
  const { nombre, telefono, restaurante_nombre, fecha, hora } = req.body;
  const sql =
    "INSERT INTO reservas (nombre, telefono, restaurante_nombre, fecha, hora, user_id) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(
    sql,
    [nombre, telefono, restaurante_nombre, fecha, hora, req.user.id],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, error: "Error al guardar la reserva" });
      res.json({ success: true, id: result.insertId });
    }
  );
});// Agregar restaurante
app.post("/restaurantes", (req, res) => {
  const { titulo, descripcion, imagen, icono, direccion, telefono, tipo_cocina, horarios, fechas_especiales, precio } = req.body;

  const sql = `
    INSERT INTO restaurantes 
      (titulo, descripcion, imagen, icono, direccion, telefono, tipo_cocina, horarios, fechas_especiales, precio)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [titulo, descripcion, imagen, icono, direccion || null, telefono || null, tipo_cocina || null, horarios || null, fechas_especiales || null, precio || null];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error al insertar restaurante:", err.sqlMessage);
      return res.status(500).json({ success: false, error: err.sqlMessage });
    }

    res.json({ success: true, id: result.insertId });
  });
});


// Obtener todos los restaurantes
app.get("/restaurantes", (req, res) => {
  const sql = "SELECT * FROM restaurantes";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error al obtener restaurantes:", err);
      return res.status(500).json({
        success: false,
        message: "Error al obtener restaurantes",
      });
    }
    res.json(results);
  });
});

// Obtener un restaurante específico por ID
app.get("/restaurantes/:id", (req, res) => {
  const restauranteId = req.params.id;
  const sql = "SELECT * FROM restaurantes WHERE id = ?";

  db.query(sql, [restauranteId], (err, results) => {
    if (err) {
      console.error("Error al obtener restaurante:", err);
      return res.status(500).json({
        success: false,
        message: "Error al obtener restaurante",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Restaurante no encontrado",
      });
    }

    res.json(results[0]);
  });
});

// Obtener información del usuario
app.get("/me", verificarToken, (req, res) => {
  const userId = req.user.id;
  const sql = "SELECT id, email, name FROM users WHERE id = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Error al obtener usuario" });
    }
    if (results.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }
    res.json({ success: true, user: results[0] });
  });
});

// Actualizar usuario
app.put("/updateuser", verificarToken, (req, res) => {
  const { name, password } = req.body;
  const userId = req.user.id;
  if (!name && !password) {
    return res
      .status(400)
      .json({ success: false, message: "Nada para actualizar" });
  }
  let sql, values;
  if (password) {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Error al encriptar contraseña" });
      sql = "UPDATE users SET name = ?, password = ? WHERE id = ?";
      values = [name, hash, userId];
      db.query(sql, values, (err) => {
        if (err)
          return res
            .status(500)
            .json({ success: false, message: "Error en la BD" });
        res.json({ success: true, message: "Usuario actualizado" });
      });
    });
  } else {
    sql = "UPDATE users SET name = ? WHERE id = ?";
    values = [name, userId];
    db.query(sql, values, (err) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Error en la BD" });
      res.json({ success: true, message: "Usuario actualizado" });
    });
  }
});

// Ver reservas
app.get("/misreservas", verificarToken, (req, res) => {
  const sql = `
    SELECT r.id, r.restaurante_nombre, r.fecha, r.hora, rest.precio,
           COALESCE(p.estado, 'pendiente') AS estado_pago
    FROM reservas r
    JOIN restaurantes rest ON r.restaurante_nombre = rest.titulo
    LEFT JOIN pagos p ON r.id = p.reserva_id
    WHERE r.user_id = ?
  `;
  db.query(sql, [req.user.id], (err, results) => {
    if (err) {
      console.error("❌ Error en /misreservas:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error al obtener reservas" });
    }
    res.json({ success: true, reservas: results });
  });
});

// Crear pago seguro con precio desde la BD (SDK nueva)
app.post("/crear-pago", verificarToken, (req, res) => {
  const { reservaId } = req.body;

  const sql = `
    SELECT r.id, r.restaurante_nombre, rest.precio 
    FROM reservas r
    JOIN restaurantes rest ON r.restaurante_nombre = rest.titulo
    WHERE r.id = ? AND r.user_id = ?
  `;

  db.query(sql, [reservaId, req.user.id], async (err, results) => {
    if (err) {
      console.error("❌ Error BD:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error en la BD" });
    }
    if (results.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Reserva no encontrada" });
    }

    const reserva = results[0];

    if (!reserva.precio) {
      console.error("⚠️ Error: el restaurante no tiene precio en la BD");
      return res.status(400).json({
        success: false,
        message: "El restaurante no tiene precio configurado",
      });
    }

    const preference = new Preference(mpClient);

    try {
      const response = await preference.create({
        body: {
          items: [
            {
              title: `Reserva en ${reserva.restaurante_nombre}`,
              unit_price: Number(reserva.precio), // ✅ precio real
              quantity: 1,
              currency_id: "COP",
            },
          ],
          back_urls: {
            success: "http://localhost:5173/pago-exitoso",
            failure: "http://localhost:5173/pago-fallido",
            pending: "http://localhost:5173/pago-pendiente",
          },
          // auto_return: "approved", // Se pondra cuando este en fase de producción o tenga una URL real
          metadata: {
            user_id: req.user.id,
            reserva_id: reserva.id,
          },
        },
      });

      console.log("✅ Preferencia creada:", response);
      res.json({ success: true, init_point: response.init_point });
    } catch (error) {
      console.error("❌ Error al crear pago en Mercado Pago:", error);
      res.status(500).json({
        success: false,
        message: "Error al crear pago en Mercado Pago",
      });
    }
  });
});

// Webhook de Mercado Pago
app.post("/webhook", (req, res) => {
  try {
    const payment = req.body;

    const userId = payment.data?.metadata?.user_id || null;
    const reservaId = payment.data?.metadata?.reserva_id || null;
    const metodo = payment.data?.payment_type_id || "desconocido";
    const monto = payment.data?.transaction_amount || 0;
    const estado = payment.data?.status || "pendiente";

    const sql =
      "INSERT INTO pagos (user_id, reserva_id, metodo, monto, estado) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [userId, reservaId, metodo, monto, estado], (err) => {
      if (err) {
        console.error("❌ Error guardando pago:", err);
      } else {
        console.log(`💾 Pago registrado: ${estado} - Reserva ${reservaId}`);
      }
    });

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error webhook:", err);
    res.sendStatus(500);
  }
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
