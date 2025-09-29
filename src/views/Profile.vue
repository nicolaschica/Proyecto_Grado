<template>
  <div class="profile">
    <h1>Bienvenido, {{ user?.name || user?.email }}</h1>
    <ul>
      <li><button @click="goProfileInfo">Mi información personal</button></li>
      <li><button @click="viewreserva">Ver mis reservas</button></li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"

const user = ref(null)
const router = useRouter()

onMounted(() => {
  const token = localStorage.getItem("token")
  if (!token) {
    router.push("/login")
    return
  }

  const savedUser = localStorage.getItem("user")
  if (savedUser) {
    user.value = JSON.parse(savedUser)
    console.log("Usuario cargado:", user.value)
  }
})

const goProfileInfo = () => {
  router.push("/profileinfo")
}

const viewreserva = () => {
  router.push("/viewreservas")
}
</script>

<style scoped>
.profile {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.profile h1 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}
.profile ul {
  list-style: none;
  padding: 0;
}
.profile li {
  margin-bottom: 10px;
}
.profile a, .profile button {
  color: #228b22;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  text-decoration: none;
}
.profile a:hover,
.profile button:hover {
  text-decoration: underline;
}
</style>
