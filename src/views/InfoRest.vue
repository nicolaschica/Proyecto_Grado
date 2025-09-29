<template>
    <div v-if="restaurante" class="info-rest">
        <!-- Hero / portada -->
        <!-- Hero / portada -->
        <header class="hero position-relative d-flex align-items-center">
            <div class="overlay"></div>
            <img :src="restaurante.imagen" class="hero-bg" alt="Portada restaurante" />
            <div class="hero-content text-white d-flex align-items-center gap-3">
                <img :src="restaurante.icono" alt="Logo" class="hero-logo shadow-lg" />
                <h1 class="display-4 fw-bold m-0">{{ restaurante.titulo }}</h1>
            </div>
        </header>


        <!-- Contenido -->
        <div class="container-fluid py-5">
            <div class="row g-4">
                <!-- Sidebar -->
                <aside class="col-lg-4">
                    <!-- Fotos -->
                    <div class="sidebar-section card shadow-sm mb-4">
                        <div class="card-header text-center fw-bold bg-white border-0">
                            📸 Galería
                        </div>
                        <div class="card-body text-center">
                            <img :src="restaurante.imagen" class="img-fluid rounded shadow-sm gallery-img" alt="Foto"
                                data-bs-toggle="modal" data-bs-target="#fotoModal" />
                            <small class="text-muted d-block mt-2">Haz clic para ampliar</small>
                        </div>
                    </div>

                    <!-- Mapa -->
                    <div class="sidebar-section card shadow-sm mb-4">
                        <div class="card-header text-center fw-bold bg-white border-0">
                            📍 Ubicación
                        </div>
                        <div class="card-body p-0">
                            <iframe v-if="restaurante.direccion"
                                :src="`https://www.google.com/maps?q=${encodeURIComponent(restaurante.direccion)}&output=embed`"
                                class="map-frame" allowfullscreen loading="lazy">
                            </iframe>
                        </div>
                    </div>

                    <!-- Redes -->
                    <div class="sidebar-section card shadow-sm">
                        <div class="card-header text-center fw-bold bg-white border-0">
                            🌐 Conéctate
                        </div>
                        <div class="card-body d-flex flex-column gap-2">
                            <a :href="`https://www.facebook.com/search/top?q=${restaurante.titulo}`" target="_blank"
                                class="btn btn-outline-primary">
                                <i class="bi bi-facebook"></i> Facebook
                            </a>
                            <a :href="`https://www.instagram.com/explore/tags/${restaurante.titulo}`" target="_blank"
                                class="btn btn-outline-danger">
                                <i class="bi bi-instagram"></i> Instagram
                            </a>
                        </div>
                    </div>
                </aside>

                <!-- Contenido principal -->
                <main class="col-lg-8">
                    <div class="card shadow-sm border-0 rounded-4">
                        <div class="card-body p-5">
                            <section class="mb-4">
                                <h5 class="section-title">📖 Descripción</h5>
                                <p class="text-muted">{{ restaurante.descripcion }}</p>
                            </section>

                            <section class="mb-4">
                                <h5 class="section-title">🍽 Tipo de Cocina</h5>
                                <p class="text-muted">{{ restaurante.tipo_cocina }}</p>
                            </section>

                            <section class="mb-4">
                                <h5 class="section-title">📍 Dirección</h5>
                                <p class="text-muted">{{ restaurante.direccion }}</p>
                            </section>

                            <section class="mb-4">
                                <h5 class="section-title">📞 Teléfono</h5>
                                <p class="text-muted">{{ restaurante.telefono }}</p>
                            </section>

                            <section class="mb-4">
                                <h5 class="section-title">🕒 Horarios</h5>
                                <p class="text-muted">{{ restaurante.horarios || "Lunes a Domingo: 8:00 AM - 10:00 PM"
                                    }}</p>
                            </section>

                            <section class="mb-4">
                                <h5 class="section-title">📅 Fechas Especiales</h5>
                                <p class="text-muted">{{ restaurante.fechas_especiales || "Disponible todo el año" }}
                                </p>
                            </section>

                            <section>
                                <h5 class="section-title">💰 Precio por Reserva</h5>
                                <p class="fs-3 fw-bold text-success mb-0">${{ restaurante.precio }} COP</p>
                            </section>

                            <!-- Botones -->
                            <div class="d-flex gap-3 justify-content-center mt-5">
                                <button class="btn btn-success btn-lg rounded-pill shadow-sm" @click="irAReserva">
                                    🪑 Reservar Ahora
                                </button>
                                <button class="btn btn-outline-dark btn-lg rounded-pill" @click="volver">
                                    ← Volver
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>

        <!-- Modal Foto -->
        <div class="modal fade" id="fotoModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-xl">
                <div class="modal-content bg-dark border-0">
                    <div class="modal-body text-center p-0">
                        <img :src="restaurante.imagen" class="img-fluid rounded shadow-lg" alt="Ampliada" />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Loader -->
    <div v-else class="d-flex flex-column align-items-center justify-content-center min-vh-100">
        <div class="spinner-border text-success mb-3" role="status"></div>
        <p class="text-muted">Cargando información del restaurante...</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const restaurante = ref(null);

const fetchRestaurante = async () => {
    try {
        const id = route.params.id;
        const response = await axios.get(`http://localhost:3000/restaurantes/${id}`);
        restaurante.value = response.data;
    } catch (error) {
        console.error("❌ Error al obtener restaurante:", error);
    }
};

const irAReserva = () => {
    router.push({ name: "reserva", query: { restauranteNombre: restaurante.value.titulo } });
};

const volver = () => {
    router.push("/home");
};

onMounted(fetchRestaurante);
</script>

<style scoped>
/* Hero elegante */
.hero {
  height: 40vh;
  overflow: hidden;
  position: relative;
  border-bottom: 4px solid #198754;
}

.hero-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(60%);
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
}

.hero-content {
  position: absolute;
  bottom: 20px; /* bajamos un poco el contenido */
  left: 40px;
  z-index: 2;
}

.hero-logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: white;
  padding: 5px;
}

/* Sidebar */
.sidebar-section {
    border-radius: 16px;
    overflow: hidden;
}

.map-frame {
    width: 100%;
    height: 250px;
    border: none;
    border-radius: 0 0 16px 16px;
}

/* Contenido principal */
.section-title {
    font-weight: 600;
    color: #198754;
    margin-bottom: 0.5rem;
}

.text-muted {
    font-size: 1rem;
    line-height: 1.6;
}

/* Imagen galería */
.gallery-img {
    transition: transform 0.3s ease;
    cursor: pointer;
}

.gallery-img:hover {
    transform: scale(1.05);
}
</style>
