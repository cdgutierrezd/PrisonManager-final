<!--
  COMPONENTE: HEADER DE NAVEGACIÓN
  
  Barra de navegación superior que se adapta según el estado de autenticación del usuario.
  
  Características:
  - Logo y nombre de la prisión (siempre visible)
  - Renderizado condicional de botones según authStore.isAuthenticated:
    * Usuario no autenticado: Botón "WARDEN ACCESS" para ir a /login
    * Usuario autenticado: Botones "USERS" y "LOGOUT"
  
  Funcionalidad:
  - handleLogout(): Cierra sesión y redirige al home
  
  Dependencias:
  - authStore: Para verificar estado de autenticación
  - useRouter: Para navegación programática
-->

<template>
    <nav class="navbar prison-navbar mb-2">
        <div class="container">
            <!-- Izquierda: Logo y Nombre de la Prisión -->
            <router-link to="/" class="navbar-brand d-flex align-items-center">
                <span class="logo-box">PC</span>
                <span class="brand-text">
                    Prison <span class="brand-highlight">El Chapo</span>
                </span>
            </router-link>

            <!-- Derecha: Botones según estado de autenticación -->
            <div class="d-flex ms-auto gap-2 align-items-center">
                <!-- Si NO está autenticado: botón de login -->
                <router-link v-if="!authStore.isAuthenticated" to="/login" class="nav-btn-custom">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                        viewBox="0 0 16 16">
                        <path fill-rule="evenodd"
                            d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z" />
                        <path fill-rule="evenodd"
                            d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
                    </svg>
                    WARDEN ACCESS
                </router-link>
                
                <!-- Si SÍ está autenticado: botones de admin -->
                <template v-else>
                    <router-link to="/admin" class="admin-btn users-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216Z"/>
                            <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
                        </svg>
                        USERS
                    </router-link>
                    
                    <button @click="handleLogout" class="admin-btn logout-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"/>
                            <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"/>
                        </svg>
                        LOGOUT
                    </button>
                </template>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { authStore } from '../store/auth.js';
import { useRouter } from 'vue-router';

const router = useRouter();

/**
 * Maneja el cierre de sesión del usuario
 * Limpia el estado de autenticación y redirige al home
 */
const handleLogout = () => {
  authStore.logout();
  router.push('/');
};
</script>

<style scoped>
/* Estilos personalizados para el Header inspirado en la imagen */
.prison-navbar {
    background-color: #000000;
    /* Fondo negro puro */
    padding: 1rem 0;
    border-bottom: 4px solid #333;
    /* Un borde sutil inferior */
}

.logo-box {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    background-color: #ff5e00;
    /* Naranja intenso de seguridad */
    color: white;
    font-weight: 900;
    font-size: 1.2rem;
    margin-right: 12px;
    /* Sin bordes redondeados para mantener el estilo bloque/industrial pero limpio */
}

.brand-text {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 1.25rem;
    font-weight: 700;
    color: white;
}

.brand-highlight {
    color: #ff5e00;
    /* El mismo naranja del logo */
}

.nav-btn-custom {
    color: white;
    text-transform: uppercase;
    font-size: 0.9rem;
    letter-spacing: 1px;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: color 0.3s ease;
}

.nav-btn-custom:hover {
    color: #ff5e00;
}

/* Botones de administración */
.admin-btn {
    background-color: transparent;
    border: 2px solid #fff;
    color: white;
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-radius: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
}

.admin-btn:hover {
    background-color: #ff5e00;
    border-color: #ff5e00;
    color: #000;
}

.create-btn {
    border-color: #ff5e00;
    color: #ff5e00;
}

.create-btn:hover {
    background-color: #ff5e00;
    color: #000;
}

.users-btn {
    border-color: #ffc107;
    color: #ffc107;
    text-decoration: none;
}

.users-btn:hover {
    background-color: #ffc107;
    color: #000;
}
</style>