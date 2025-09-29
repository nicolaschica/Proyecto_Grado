<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center register-bg">
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-10 col-xl-8">
          <div class="card shadow-lg border-0 rounded-4 overflow-hidden">
            <div class="row g-0">
              <!-- Panel izquierdo -->
              <div class="col-md-6 bg-gradient-custom text-white d-flex align-items-center">
                <div class="p-5 text-center w-100">
                  <h2 class="fw-bold mb-3">¡Bienvenido de nuevo!</h2>
                  <p class="mb-4 opacity-90">
                    ¿Ya tienes una cuenta? Inicia sesión aquí y conéctate con nosotros
                  </p>
                  <button 
                    @click="$router.push('/login')" 
                    class="btn btn-outline-light btn-lg rounded-pill px-4 fw-bold"
                  >
                    ← Iniciar sesión
                  </button>
                </div>
              </div>

              <!-- Panel derecho -->
              <div class="col-md-6 bg-white">
                <div class="p-5 d-flex align-items-center justify-content-center" style="min-height: 600px;">
                  <div class="w-100" style="max-width: 400px;">
                    <form @submit.prevent="register">
                      <h2 class="text-center text-dark mb-4 fw-bold">Registro</h2>

                      <!-- Nombre Input -->
                      <div class="form-floating mb-4">
                        <input 
                          id="name" 
                          type="text" 
                          class="form-control border-0 border-bottom border-2 rounded-0 bg-transparent custom-input" 
                          v-model="name" 
                          placeholder="Nombre de usuario"
                          required 
                        />
                        <label for="name" class="text-muted">Nombre de usuario</label>
                      </div>

                      <!-- Email Input -->
                      <div class="form-floating mb-4">
                        <input 
                          id="email" 
                          type="email" 
                          class="form-control border-0 border-bottom border-2 rounded-0 bg-transparent custom-input" 
                          v-model="email" 
                          placeholder="Correo electrónico"
                          required 
                        />
                        <label for="email" class="text-muted">Correo electrónico</label>
                      </div>

                      <!-- Password Input -->
                      <div class="form-floating mb-4">
                        <input 
                          id="password" 
                          type="password" 
                          class="form-control border-0 border-bottom border-2 rounded-0 bg-transparent custom-input" 
                          v-model="password" 
                          placeholder="Contraseña"
                          required 
                        />
                        <label for="password" class="text-muted">Contraseña</label>
                      </div>

                      <!-- Submit Button -->
                      <div class="d-grid mt-4">
                        <button type="submit" class="btn btn-primary btn-lg rounded-3 fw-bold">
                          Guardar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'

const name = ref('')
const email = ref('')
const password = ref('')
const router = useRouter()

const register = async () => {
  try {
    if (password.value.length < 6) {
      return Swal.fire({
        icon: 'warning',
        title: 'Contraseña débil',
        text: 'La contraseña debe tener mínimo 6 caracteres'
      })
    }

    const res = await axios.post('http://localhost:3000/register', {
      name: name.value,
      email: email.value,
      password: password.value
    })

    if (res.data.success) {
      await Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'Tu cuenta ha sido creada',
        timer: 2000,
        showConfirmButton: false
      })
      router.push('/login')
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'El correo ya existe',
        text: 'Por favor usa otro'
      })
    }
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.response?.data?.message || 'Hubo un problema al registrar'
    })
  }
}
</script>

<style scoped>
.register-bg {
  background-image: url(../assets/fondo.jpeg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.bg-gradient-custom {
  background: linear-gradient(to bottom right, #3b82f6, #228B22) !important;
}

.custom-input {
  border-color: #ddd !important;
  padding: 12px 0 8px 0 !important;
  box-shadow: none !important;
}

.custom-input:focus {
  border-color: #228B22 !important;
  box-shadow: none !important;
}

.form-floating > label {
  color: #888 !important;
}

.form-floating > .custom-input:focus ~ label,
.form-floating > .custom-input:not(:placeholder-shown) ~ label {
  color: #228B22 !important;
}

.btn-outline-light:hover {
  background-color: white;
  border-color: white;
  color: #3b82f6 !important;
  transform: translateY(-2px);
}

.btn-primary {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.btn-primary:hover {
  background-color: #1e5fc0;
  border-color: #1e5fc0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* Transiciones suaves */
.btn {
  transition: all 0.3s ease;
}
</style>