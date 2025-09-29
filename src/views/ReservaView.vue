<template>
  <div class="reserva-container d-flex flex-column align-items-center justify-content-center">
    <div class="card shadow-lg border-0 reserva-card">
      <div class="card-header text-center py-3">
        <h2 class="mb-0">Reserva en {{ restauranteNombre }}</h2>
      </div>

      <div class="card-body">
        <form @submit.prevent="registrarReserva">
          <div class="mb-3 form-floating">
            <input id="nombre" type="text" class="form-control" v-model="nombre" placeholder="Nombre completo" required />
            <label for="nombre">Nombre completo</label>
          </div>

          <div class="mb-3 form-floating">
            <input id="telefono" type="tel" class="form-control" v-model="telefono" placeholder="Teléfono" required />
            <label for="telefono">Teléfono</label>
          </div>

          <div class="mb-3 form-floating">
            <input id="restaurante" type="text" class="form-control" v-model="restauranteNombre" readonly />
            <label for="restaurante">Restaurante</label>
          </div>

          <div class="row g-3">
            <div class="col-md-6 form-floating">
              <input id="fecha" type="date" class="form-control" v-model="fecha" placeholder="Fecha" required />
              <label for="fecha">Fecha</label>
            </div>

            <div class="col-md-6 form-floating">
              <input id="hora" type="time" class="form-control" v-model="hora" placeholder="Hora" required />
              <label for="hora">Hora</label>
            </div>
          </div>

          <div class="d-grid mt-4">
            <button type="submit" class="btn btn-pastel btn-lg shadow-sm">
              Confirmar Reserva
            </button>
          </div>
        </form>
      </div>

      <div class="card-footer text-center text-muted small">
        © 2025 | Tu Mesa A Un Solo Clic
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()

const nombre = ref('')
const telefono = ref('')
const fecha = ref('')
const hora = ref('')
const restauranteNombre = ref('')

// Interceptor para incluir token en cada petición
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Al cargar, verificar que haya token
onMounted(() => {
  const token = localStorage.getItem('token')
  if (!token) {
    Swal.fire({
      icon: 'warning',
      title: 'Sesión expirada',
      text: 'Por favor, inicia sesión para reservar'
    }).then(() => {
      router.push('/login')
    })
    return
  }

  const restauranteNombreQuery = route.query.restauranteNombre
  restauranteNombre.value = restauranteNombreQuery || 'Desconocido'
})

// Enviar la reserva
const registrarReserva = async () => {
  try {
    const res = await axios.post('http://localhost:3000/reservas', {
      nombre: nombre.value,
      telefono: telefono.value,
      restaurante_nombre: restauranteNombre.value,
      fecha: fecha.value,
      hora: hora.value
    })

    if (res.data.success) {
      Swal.fire({
        icon: 'success',
        title: '¡Reserva registrada!',
        text: 'Tu reserva ha sido confirmada exitosamente',
        confirmButtonColor: '#a8d5ba'
      }).then(() => {
        router.push('/home')
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo registrar la reserva',
        confirmButtonColor: '#f8a5c2'
      })
    }
  } catch (err) {
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      Swal.fire({
        icon: 'warning',
        title: 'Sesión expirada',
        text: 'Vuelve a iniciar sesión'
      }).then(() => {
        localStorage.removeItem('token')
        router.push('/login')
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un problema al registrar la reserva',
        confirmButtonColor: '#f8a5c2'
      })
    }
    console.error(err)
  }
}
</script>

<style scoped>
.reserva-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #fdf2f8, #f0f9ff, #f0fdf4);
  padding: 40px 20px;
}

.reserva-card {
  width: 100%;
  max-width: 550px;
  border-radius: 20px;
  overflow: hidden;
  animation: fadeIn 0.8s ease-in-out;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.card-header {
  background: linear-gradient(135deg, #ddd6fe, #bfdbfe, #bbf7d0);
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.form-floating input {
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  background-color: #fefefe;
  transition: all 0.3s ease;
}

.form-floating input:focus {
  border-color: #a78bfa;
  box-shadow: 0 0 0 0.2rem rgba(167, 139, 250, 0.25);
  background-color: #ffffff;
}

.form-floating label {
  color: #6b7280;
}

.btn-pastel {
  background: linear-gradient(135deg, #a78bfa, #7dd3fc, #86efac);
  border: none;
  border-radius: 12px;
  color: #374151;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.btn-pastel:hover {
  background: linear-gradient(135deg, #9333ea, #0ea5e9, #22c55e);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(167, 139, 250, 0.3);
}

.card-footer {
  background: linear-gradient(135deg, #f3f4f6, #fef3f4);
  border-top: 1px solid #e5e7eb;
  color: #9ca3af;
}

@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: translateY(30px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

/* Estilos adicionales para inputs readonly */
.form-floating input[readonly] {
  background-color: #f9fafb;
  color: #6b7280;
}
</style>