/**
 * STORE DE AUTENTICACIÓN
 * 
 * Sistema reactivo global para gestionar el estado de autenticación del usuario.
 * Utiliza el patrón de store reactivo de Vue 3 y sincroniza el estado con localStorage
 * para persistir la sesión incluso después de recargar la página.
 * 
 * Propiedades:
 * - isAuthenticated: Boolean que indica si el usuario está autenticado
 * 
 * Métodos:
 * - login(): Marca al usuario como autenticado y guarda el estado en localStorage
 * - logout(): Cierra sesión eliminando el estado de autenticación
 * - checkAuth(): Verifica el estado de autenticación desde localStorage al iniciar la app
 */

import { reactive } from 'vue'

export const authStore = reactive({
  // Estado de autenticación del usuario
  isAuthenticated: false,
  
  /**
   * Inicia sesión del usuario
   * Actualiza el estado reactivo y persiste en localStorage
   */
  login() {
    this.isAuthenticated = true
    localStorage.setItem('authenticated', 'true')
  },
  
  /**
   * Cierra sesión del usuario
   * Limpia el estado reactivo y elimina datos de localStorage
   */
  logout() {
    this.isAuthenticated = false
    localStorage.removeItem('authenticated')
  },
  
  /**
   * Verifica el estado de autenticación desde localStorage
   * Se ejecuta al cargar la aplicación para restaurar sesiones activas
   */
  checkAuth() {
    this.isAuthenticated = localStorage.getItem('authenticated') === 'true'
  }
})
