import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import Swal from 'sweetalert2'

// Configurar base URL global para Axios
axios.defaults.baseURL = 'http://localhost:3000'

// Interceptor para añadir el token en cada petición
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para manejar errores de autenticación
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      Swal.fire({
        icon: 'warning',
        title: 'Sesión expirada',
        text: 'Por favor, inicia sesión nuevamente'
      }).then(() => {
        localStorage.removeItem('token')
        router.push('/login')
      })
    }
    return Promise.reject(error)
  }
)

const app = createApp(App)
app.use(router)
app.mount('#app')
app.config.globalProperties.$axios = axios
app.config.globalProperties.$swal = Swal