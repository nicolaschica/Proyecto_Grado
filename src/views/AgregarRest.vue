<template>
  <div class="agregar-restaurante">
    <h2>Agregar Restaurante</h2>
    <form @submit.prevent="agregarRestaurante">
      <div>
        <label for="titulo">Título:</label>
        <input type="text" v-model="titulo" required />
      </div>

      <div>
        <label for="descripcion">Descripción:</label>
        <textarea v-model="descripcion" required></textarea>
      </div>

      <div>
        <label for="imagen">URL de la Imagen:</label>
        <input type="text" v-model="imagen" required />
      </div>

      <div>
        <label for="icono">URL del Icono:</label>
        <input type="text" v-model="icono" required />
      </div>

      <div>
        <label for="direccion">Dirección:</label>
        <input type="text" v-model="direccion" />
      </div>

      <div>
        <label for="telefono">Teléfono:</label>
        <input type="text" v-model="telefono" />
      </div>

      <div>
        <label for="tipo_cocina">Tipo de Cocina:</label>
        <input type="text" v-model="tipo_cocina" />
      </div>

      <div>
        <label for="horarios">Horarios:</label>
        <input type="text" v-model="horarios" />
      </div>

      <div>
        <label for="fechas_especiales">Fechas Especiales:</label>
        <input type="text" v-model="fechas_especiales" />
      </div>

      <div>
        <label for="precio">Precio:</label>
        <input type="text" v-model="precio" />
      </div>

      <button type="submit">Agregar Restaurante</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'

const router = useRouter()

const titulo = ref('')
const descripcion = ref('')
const imagen = ref('')
const icono = ref('')
const direccion = ref('')
const telefono = ref('')
const tipo_cocina = ref('')
const horarios = ref('')
const fechas_especiales = ref('')
const precio = ref('')

const agregarRestaurante = async () => {
  try {
    const response = await axios.post('http://localhost:3000/restaurantes', {
      titulo: titulo.value,
      descripcion: descripcion.value,
      imagen: imagen.value,
      icono: icono.value,
      direccion: direccion.value || null,
      telefono: telefono.value || null,
      tipo_cocina: tipo_cocina.value || null,
      horarios: horarios.value || null,
      fechas_especiales: fechas_especiales.value || null,
      precio: precio.value || null
    })

    if (response.data.success) {
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Restaurante agregado exitosamente.',
        confirmButtonColor: '#228b22'
      })

      // Limpiar formulario
      titulo.value = ''
      descripcion.value = ''
      imagen.value = ''
      icono.value = ''
      direccion.value = ''
      telefono.value = ''
      tipo_cocina.value = ''
      horarios.value = ''
      fechas_especiales.value = ''
      precio.value = ''
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al agregar el restaurante.',
        confirmButtonColor: '#d33'
      })
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo conectar con el servidor.',
      confirmButtonColor: '#d33'
    })
    console.error('Error al agregar el restaurante:', error)
  }
}
</script>

<style scoped>
.agregar-restaurante {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
}

form div {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input,
textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #228b22;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #1e7c1e;
}
</style>
