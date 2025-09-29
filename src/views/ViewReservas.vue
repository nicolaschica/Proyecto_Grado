<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"

const reservas = ref([])

const agregarPago = async (reserva) => {
  try {
    const token = localStorage.getItem("token")
    const res = await axios.post(
      "http://localhost:3000/crear-pago",
      { reservaId: reserva.id },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    if (res.data.success) {
      window.location.href = res.data.init_point // Redirige a Mercado Pago
    }
  } catch (err) {
    console.error("Error iniciando pago:", err)
  }
}

onMounted(async () => {
  const token = localStorage.getItem("token")
  if (token) {
    try {
      const res = await axios.get("http://localhost:3000/misreservas", {
        headers: { Authorization: `Bearer ${token}` }
      })
      reservas.value = res.data.reservas
    } catch (err) {
      console.error("Error cargando reservas", err)
    }
  }
})
</script>


<template>
  <div class="container">
    <div class="card">
      <h2>📅 Mis Reservas</h2>

      <div v-if="reservas.length > 0" class="reservas-list">
        <div v-for="r in reservas" :key="r.id" class="reserva-item">
          <h3>{{ r.restaurante_nombre }}</h3>
          <p><strong>Fecha:</strong> {{ r.fecha ? new Date(r.fecha).toLocaleDateString() : "N/A" }}</p>
          <p><strong>Hora:</strong> {{ r.hora ? r.hora.substring(0,5) : "N/A" }}</p>

          <!-- Botón de pago -->
          <button @click="agregarPago(r)" class="pago-btn">
            💳 Agregar Pago
          </button>

          <!-- Estado del pago -->
          <p v-if="r.estado_pago" :class="['estado', r.estado_pago]">
            Estado del pago: {{ r.estado_pago }}
          </p>
        </div>
      </div>

      <p v-else class="no-reservas">No tienes reservas aún.</p>
    </div>
  </div>
</template>


<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 40px 20px;
  font-family: sans-serif;
}

.card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 30px;
  width: 100%;
  max-width: 700px;
  animation: fadeIn 0.6s ease-in-out;
}

.card h2 {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 25px;
}

.reservas-list {
  display: grid;
  gap: 16px;
}

.reserva-item {
  padding: 15px 20px;
  border-radius: 12px;
  background: #f9fafb;
  border-left: 6px solid #3b82f6;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.reserva-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.reserva-item h3 {
  margin: 0 0 5px;
  font-size: 20px;
  color: #228B22;
}

.reserva-item p {
  margin: 2px 0;
  color: #444;
}

.no-reservas {
  text-align: center;
  color: #666;
  font-size: 16px;
  margin-top: 20px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.pago-btn {
  margin-top: 10px;
  padding: 8px 15px;
  background: #3b82f6;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
}
.pago-btn:hover {
  background: #1e5fc0;
}

.estado {
  font-weight: bold;
  margin-top: 5px;
}
.estado.approved {
  color: green;
}
.estado.pending {
  color: orange;
}
.estado.rejected {
  color: red;
}
.no-reservas {
  text-align: center;
  color: #666;
  margin-top: 20px;
}
.reservas-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.reserva-item {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
}
.card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.container {
  max-width: 600px;
  margin: 40px auto;
  padding: 0 20px;
}
h2 {
  text-align: center;
  margin-bottom: 20px;
}
h3 {
  margin-bottom: 10px;
}
p {
  margin: 5px 0;
}.pago-btn {
  margin-top: 10px;
  padding: 8px 15px;
  background: #3b82f6;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
}
.pago-btn:hover {
  background: #1e5fc0;
}

.estado {
  font-weight: bold;
  margin-top: 5px;
}
.estado.approved {
  color: green;
}
.estado.pending {
  color: orange;
}
.estado.rejected {
  color: red;
}
.no-reservas {
  text-align: center;
  color: #666;
  margin-top: 20px;
}
.reservas-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.reserva-item {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
}
.card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.container {
  max-width: 600px;
  margin: 40px auto;
  padding: 0 20px;
}
h2 {
  text-align: center;
  margin-bottom: 20px;
}
h3 {
  margin-bottom: 10px;
}
p {
  margin: 5px 0;
}
</style>
