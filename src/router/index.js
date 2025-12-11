/**
 * CONFIGURACIÓN DEL ENRUTAMIENTO
 * 
 * Define las rutas de la aplicación y los mecanismos de protección mediante guardias de navegación.
 * Utiliza Vue Router 4 con historial HTML5 para URLs limpias sin el símbolo hash.
 * 
 * Rutas disponibles:
 * - / (Home): Vista principal con listado de prisioneros, accesible para todos
 * - /login (Login): Página de autenticación, solo para usuarios no autenticados
 * - /admin (Admin): Panel de administración de usuarios, requiere autenticación
 * 
 * Sistema de protección:
 * - requiresAuth: Redirige a /login si el usuario no está autenticado
 * - requiresGuest: Redirige a / si el usuario ya está autenticado
 */

import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Admin from '../views/Admin.vue'
import { authStore } from '../store/auth.js'

// Definición de rutas de la aplicación
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
    // Sin meta, accesible para todos los usuarios
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true } // Solo usuarios no autenticados
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { requiresAuth: true } // Solo usuarios autenticados
  }
]

// Crear instancia del router con historial HTML5
const router = createRouter({
  history: createWebHistory(),
  routes
})

/**
 * Guardia de navegación global
 * Se ejecuta antes de cada cambio de ruta para verificar permisos de acceso
 * 
 * @param {Route} to - Ruta de destino
 * @param {Route} from - Ruta de origen
 * @param {Function} next - Función para continuar la navegación
 */
router.beforeEach((to, from, next) => {
  // Verificar el estado de autenticación desde localStorage
  authStore.checkAuth()
  
  // Si la ruta requiere autenticación y el usuario no está autenticado
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login') // Redirigir al login
  }
  // Si la ruta requiere ser invitado (no autenticado) y el usuario está autenticado
  else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/') // Redirigir al home
  } else {
    next() // Permitir navegación
  }
})

export default router