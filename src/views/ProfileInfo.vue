<template>
  <div class="profile-container">
    <!-- Tarjeta de Perfil -->
    <div class="profile-card">
      <!-- Avatar + Nombre -->
      <div class="profile-header">
        <div class="avatar">
          {{ user?.name?.charAt(0).toUpperCase() || "U" }}
        </div>
        <h2>{{ user?.name || "Usuario" }}</h2>
        <p class="email">{{ user?.email }}</p>
      </div>

      <!-- Información -->
      <div class="profile-info">
        <div class="info-item">
          <span class="label">Nombre</span>
          <span class="value">{{ user?.name || "No disponible" }}</span>
        </div>

        <div class="info-item">
          <span class="label">Correo</span>
          <span class="value">{{ user?.email || "No disponible" }}</span>
        </div>

        <div class="info-item">
          <span class="label">Contraseña</span>
          <span class="value">********</span>
        </div>
      </div>

      <!-- Botones -->
      <div class="actions">
        <button class="secondary-btn" @click="goBack">Volver</button>
        <button class="primary-btn" @click="openModal = true">Editar</button>
      </div>
    </div>

    <!-- Modal Editar -->
    <div v-if="openModal" class="modal-overlay">
      <div class="modal-card">
        <h3>Editar Información</h3>
        <form @submit.prevent="updateUser">
          <div class="input-group">
            <label>Nuevo Nombre</label>
            <input type="text" v-model="form.name" required />
          </div>

          <div class="input-group">
            <label>Nueva Contraseña</label>
            <input type="password" v-model="form.password" />
          </div>

          <div class="modal-actions">
            <button type="button" class="secondary-btn" @click="openModal = false">Cancelar</button>
            <button type="submit" class="primary-btn">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const user = ref(null);
const openModal = ref(false);
const form = ref({ name: "", password: "" });

const fetchUserInfo = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:3000/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.data.success) {
      user.value = res.data.user;
      form.value.name = res.data.user.name;
    }
  } catch (err) {
    router.push("/login");
  }
};

const updateUser = async () => {
  try {
    const token = localStorage.getItem("token");
    await axios.put(
      "http://localhost:3000/updateuser",
      { name: form.value.name, password: form.value.password },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    user.value.name = form.value.name;
    openModal.value = false;
    alert("Perfil actualizado correctamente");
  } catch (err) {
    alert("Error al actualizar");
  }
};

const goBack = () => router.push("/profile");

onMounted(() => {
  fetchUserInfo();
});
</script>

<style scoped>
/* Fondo general */
.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f4f7f9;
  font-family: "Segoe UI", sans-serif;
}

/* Tarjeta */
.profile-card {
  background: #fff;
  border-radius: 20px;
  padding: 30px;
  width: 400px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  text-align: center;
  animation: fadeIn 0.4s ease;
}

/* Header con avatar */
.profile-header {
  margin-bottom: 20px;
}

.avatar {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #3b82f6, #228b22);
  color: white;
  font-size: 32px;
  font-weight: bold;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.profile-header h2 {
  font-size: 22px;
  font-weight: bold;
  color: #333;
}

.email {
  font-size: 14px;
  color: #666;
}

/* Info */
.profile-info {
  margin: 20px 0;
  text-align: left;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px dashed #ddd;
}

.label {
  font-weight: bold;
  color: #555;
}

.value {
  color: #333;
}

/* Botones */
.actions {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.primary-btn {
  background: #3b82f6;
  color: white;
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s;
}

.primary-btn:hover {
  background: #1e5fc0;
}

.secondary-btn {
  background: transparent;
  border: 2px solid #228b22;
  color: #228b22;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s;
}

.secondary-btn:hover {
  background: #228b22;
  color: white;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-card {
  background: #fff;
  padding: 25px;
  border-radius: 15px;
  width: 350px;
  max-width: 90%;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease;
}

.modal-card h3 {
  margin-bottom: 15px;
  color: #333;
  text-align: center;
}

.input-group {
  margin-bottom: 15px;
  text-align: left;
}

.input-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: #555;
}

.input-group input {
  width: 100%;
  padding: 8px;
  border: 2px solid #ddd;
  border-radius: 6px;
  outline: none;
  transition: 0.3s;
}

.input-group input:focus {
  border-color: #3b82f6;
}

/* Animaciones */
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
