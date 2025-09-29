<template>
  <div class="home-wrapper min-vh-100 d-flex flex-column">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-gradient-custom shadow-sm">
      <div class="container-fluid px-4">
        <h1 class="navbar-brand mb-0 h1 fw-bold">Tu mesa a un solo clic</h1>
        
        <div class="d-flex align-items-center gap-2">
          <!-- Botón Perfil -->
          <button 
            class="btn btn-outline-light btn-sm rounded-pill d-flex align-items-center gap-2" 
            @click="goProfile"
          >
            <i class="bi bi-person-circle"></i> 
            <span class="d-none d-sm-inline">Mi Perfil</span>
          </button>

          <!-- Botón Cerrar sesión -->
          <button 
            @click="logout" 
            class="btn btn-danger btn-sm rounded-pill"
          >
            <i class="bi bi-box-arrow-right d-sm-none"></i>
            <span class="d-none d-sm-inline">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-grow-1 py-5 bg-light-custom">
      <div class="container-fluid px-4">
        <div class="row">
          <div class="col-12 mb-4">
            <h2 class="text-center fw-bold text-dark mb-4">Descubre nuestros restaurantes</h2>
            <p class="text-center text-muted">Elige tu restaurante favorito y haz tu reserva en un solo clic</p>
          </div>
        </div>
        
        <div class="row g-4">
          <div 
            class="col-12 col-md-6 col-lg-4" 
            v-for="rest in restaurantes" 
            :key="rest.id"
          >
            <div class="card h-100 border-0 shadow-sm restaurant-card">
              <div class="position-relative overflow-hidden">
                <img 
                  :src="rest.imagen" 
                  alt="Restaurante" 
                  class="card-img-top restaurant-img"
                />
                <div class="card-img-overlay d-flex align-items-end p-0">
                  <div class="bg-dark bg-opacity-50 text-white p-3 w-100">
                    <h5 class="card-title mb-1 fw-bold">{{ rest.titulo }}</h5>
                  </div>
                </div>
              </div>
              
              <div class="card-body d-flex flex-column">
                <p class="card-text text-muted flex-grow-1">{{ rest.descripcion }}</p>
                
                <div class="d-grid mt-3">
                  <button 
                    @click="irADetalle(rest.id)"
                    class="btn btn-primary rounded-pill fw-semibold"
                  >
                    <i class="bi bi-eye me-2"></i>Ver más detalles
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Estado vacío -->
        <div v-if="restaurantes.length === 0" class="row">
          <div class="col-12 text-center py-5">
            <div class="empty-state">
              <i class="bi bi-shop display-1 text-muted mb-3"></i>
              <h3 class="text-muted">No hay restaurantes disponibles</h3>
              <p class="text-muted">Vuelve pronto para ver nuestras opciones</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-dark text-light text-center py-4">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <p class="mb-2 fw-semibold">© 2025 | Tu Mesa A Un Solo Clic</p>
            <p class="mb-0 small text-light-emphasis">
              Desarrollado por <strong>Nicolas Chica</strong> | <strong>Juan Bastidas</strong> | <strong>Juan Cubides</strong>
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'

const router = useRouter()
const restaurantes = ref([])

const logout = () => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: '¿Deseas cerrar tu sesión?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sí, cerrar sesión',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.clear()
      router.push('/login')
    }
  })
}

const goProfile = () => {
  router.push('/profile')
}

const fetchRestaurantes = async () => {
  try {
    const response = await axios.get('http://localhost:3000/restaurantes') 
    restaurantes.value = response.data
  } catch (error) {
    console.error("Error al obtener los restaurantes:", error)
    if (error.response?.status === 401 || error.response?.status === 403) {
      Swal.fire({
        icon: 'warning',
        title: 'Sesión expirada',
        text: 'Por favor vuelve a iniciar sesión'
      })
      router.push('/login')
    }
  }
}

onMounted(() => {
  fetchRestaurantes()
})

const irADetalle = (id) => {
  router.push({ name: "infoRest", params: { id } })
}
</script>

<style scoped>
.bg-gradient-custom {
  background: linear-gradient(135deg, #3b82f6, #228B22) !important;
}

.bg-light-custom {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef) !important;
}

.restaurant-card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.restaurant-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15) !important;
}

.restaurant-img {
  height: 250px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.restaurant-card:hover .restaurant-img {
  transform: scale(1.05);
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  border: none;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #1e40af, #1e3a8a);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-outline-light:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-1px);
}

.btn-danger {
  transition: all 0.3s ease;
}

.btn-danger:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
}

.empty-state {
  padding: 3rem 1rem;
}

/* Animación de entrada para las cards */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.restaurant-card {
  animation: fadeInUp 0.6s ease-out;
}

.restaurant-card:nth-child(1) { animation-delay: 0.1s; }
.restaurant-card:nth-child(2) { animation-delay: 0.2s; }
.restaurant-card:nth-child(3) { animation-delay: 0.3s; }
.restaurant-card:nth-child(4) { animation-delay: 0.4s; }
.restaurant-card:nth-child(5) { animation-delay: 0.5s; }
.restaurant-card:nth-child(6) { animation-delay: 0.6s; }

/* Responsividad mejorada */
@media (max-width: 768px) {
  .restaurant-img {
    height: 200px;
  }
  
  .card-img-overlay .bg-dark {
    padding: 1rem !important;
  }
}

@media (max-width: 576px) {
  .restaurant-img {
    height: 180px;
  }
}
</style>