/**
 * ARCHIVO PRINCIPAL DE LA APLICACIÓN
 * 
 * Este archivo es el punto de entrada de la aplicación Vue 3.
 * Se encarga de:
 * - Crear la instancia principal de Vue
 * - Registrar el sistema de enrutamiento (Vue Router)
 * - Importar los estilos globales de Bootstrap
 * - Montar la aplicación en el elemento DOM con id 'app'
 */

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Crear la instancia de Vue con el componente raíz App
const app = createApp(App)

// Registrar el router para la navegación entre vistas
app.use(router)

// Montar la aplicación en el elemento HTML con id 'app'
app.mount('#app')