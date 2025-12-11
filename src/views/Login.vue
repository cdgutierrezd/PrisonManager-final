<!--
  VISTA: LOGIN
  
  Página de autenticación para administradores de la prisión.
  Permite el acceso al sistema mediante verificación de credenciales contra MockAPI.
  
  Características:
  - Formulario con campos de usuario y contraseña
  - Validación contra la API de usuarios (/api/users)
  - Manejo de errores con mensajes informativos
  - Redirección automática al home después del login exitoso
  - Diseño temático carcelario con icono de candado
  
  Flujo de autenticación:
  1. Usuario ingresa credenciales
  2. handleLogin() valida contra usersService.login()
  3. Si es válido: actualiza authStore y redirige a '/'
  4. Si es inválido: muestra mensaje de error
  
  Protección de ruta:
  - Meta: requiresGuest (solo accesible si NO está autenticado)
  - Si el usuario ya está autenticado, el router lo redirige a '/'
  
  Componentes:
  - HeaderNav: Barra de navegación superior
-->

<script setup>
import HeaderNav from '../components/HeaderNav.vue';
import { authStore } from '../store/auth.js';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { login } from '../services/usersService.js';

const router = useRouter();

// Estados reactivos del formulario
const username = ref('');
const password = ref('');
const errorMessage = ref('');

/**
 * Maneja el proceso de autenticación
 * Valida credenciales contra la API y actualiza el estado de autenticación
 * @param {Event} e - Evento del formulario
 */
const handleLogin = async (e) => {
  e.preventDefault();
  errorMessage.value = '';
  
  try {
    // Verificar credenciales contra MockAPI
    const user = await login(username.value, password.value);
    
    if (user) {
      // Login exitoso: actualizar store y redirigir
      authStore.login();
      router.push('/');
    } else {
      // Credenciales incorrectas
      errorMessage.value = 'Invalid credentials';
    }
  } catch (error) {
    // Error de conexión con la API
    errorMessage.value = 'CONNECTION ERROR: Unable to verify credentials';
  }
};
</script>

<template>
  <HeaderNav></HeaderNav>
  <div class="login-container">
    <div class="security-card">
        <!-- Ícono de Candado Rojo -->
        <div class="lock-circle">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="lock-icon">
                <path stroke-linecap="square" stroke-linejoin="miter" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
        </div>

        <!-- Títulos -->
        <h1 class="title">RESTRICTED AREA</h1>
        <p class="subtitle">Authorized personnel only</p>

        <!-- Formulario -->
        <form @submit="handleLogin">
            <div class="input-wrapper">
                <input 
                  type="text" 
                  class="custom-input" 
                  placeholder="admin"
                  v-model="username"
                  required>
                <!-- SVG User (icono de usuario) -->
                <svg class="cursor-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
            </div>

            <div class="input-wrapper">
                <input 
                  type="password" 
                  class="custom-input" 
                  placeholder="123"
                  v-model="password"
                  required>
                <!-- SVG Lock (icono de candado) -->
                <svg class="cursor-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5s-5 2.24-5 5v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
            </div>

            <!-- Mensaje de error -->
            <div v-if="errorMessage" class="error-message">
                {{ errorMessage }}
            </div>

            <button type="submit" class="btn-enter">
                LOGIN
            </button>
        </form>
    </div>
  </div>
</template>
<style scoped>
        /* Contenedor principal centrado */
        .login-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            width: 100%;
        }

        /* La Tarjeta Principal */
        .security-card {
            background-color: #dcdde1;
            border: 6px solid #000;
            width: 100%;
            max-width: 450px;
            padding: 40px 30px;
            text-align: center;
            position: relative;
        }

        /* Ícono del Candado */
        .lock-circle {
            width: 100px;
            height: 100px;
            background-color: #f52f2f;
            border: 3px solid #000;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto 25px auto;
            color: white;
        }

        .lock-icon {
            width: 50px;
            height: 50px;
        }

        /* Textos */
        .title {
            font-weight: 700;
            font-size: 1.8rem;
            text-transform: uppercase;
            color: #fff; /* Blanco como en la imagen */
            margin-bottom: 5px;
            letter-spacing: 1px;
            -webkit-text-stroke: 1px #000;
        }

        .subtitle {
            font-size: 1rem;
            color: #333;
            margin-bottom: 30px;
            font-weight: bold;
        }

        /* Input de Contraseña */
        .custom-input {
            width: 100%;
            background-color: #ffffff;
            border: 2px solid #000;
            padding: 12px;
            font-size: 1.2rem;
            margin-bottom: 20px;
            border-radius: 0; /* Bordes cuadrados */
            outline: none;
            box-shadow: 4px 4px 0px rgba(0,0,0,0.1); /* Sombra interna sutil */
        }

        .custom-input:focus {
            background-color: #fff;
            border-color: #000;
            box-shadow: 4px 4px 0px rgba(0,0,0,0.2);
        }

        /* Botón de Entrar */
        .btn-enter {
            display: block;
            width: 100%;
            background-color: #ff5e00;
            color: black;
            border: var(--border-black);
            padding: 12px;
            font-size: 1.2rem;
            font-weight: bold;
            text-transform: uppercase;
            text-decoration: none;
            border-radius: 0;
            position: relative;
            
            /* Sombra dura negra característica */
            box-shadow: 6px 6px 0px #000;
            transition: transform 0.1s, box-shadow 0.1s;
        }

        .btn-enter:hover {
            background-color: #e54e00;
            transform: translate(2px, 2px);
            box-shadow: 4px 4px 0px #000;
            color: black;
        }

        .btn-enter:active {
            transform: translate(6px, 6px);
            box-shadow: 0px 0px 0px #000;
        }

        /* Mensaje de error */
        .error-message {
            background-color: #dc3545;
            color: white;
            border: 3px solid #000;
            padding: 12px;
            margin-bottom: 20px;
            font-weight: bold;
            text-align: center;
            text-transform: uppercase;
            font-family: 'Courier New', monospace;
            letter-spacing: 1px;
            box-shadow: 4px 4px 0px #000;
        }

        /* Cursor parpadeante personalizado en el input */
        .input-wrapper {
            position: relative;
        }
        
        /* Simulación del cursor de la imagen */
        .cursor-icon {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            width: 20px; 
            opacity: 0.5;
            pointer-events: none;
        }

</style>