import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import HomeView from "../views/HomeView.vue";
import ReservaView from "@/views/ReservaView.vue";
import AgregarRest from "@/views/AgregarRest.vue";
import ProfileView from "@/views/Profile.vue";
import ViewReservas from "@/views/ViewReservas.vue";
import ProfileInfo from "@/views/ProfileInfo.vue";
import InfoRest from "@/views/InfoRest.vue";

const routes = [
  { path: "/login", name: "login", component: LoginView },
  { path: "/", name: "register", component: RegisterView },
  { path: "/home", name: "home", component: HomeView, meta: { requiresAuth: true } },
  { path: "/reserva", name: "reserva", component: ReservaView, meta: { requiresAuth: true } },
  { path: "/restaurantes", name: "restaurantes", component: AgregarRest, meta: { requiresAuth: true } },
  { path: "/profile", name: "profile", component: ProfileView, meta: { requiresAuth: true } },
  { path: "/viewreservas", name: "viewreservas", component: ViewReservas, meta: { requiresAuth: true } },
  { path: "/profileinfo", name: "ProfileInfo", component: ProfileInfo, meta: { requiresAuth: true } },
  { path: "/restaurante/:id", name: "infoRest", component: InfoRest, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("token");

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else {
    next();
  }
});

export default router;
