<!--
  COMPONENTE: BANNER PRINCIPAL DEL HOME
  
  Banner informativo que cambia su contenido según el estado de autenticación.
  
  Comportamiento condicional:
  - Usuario no autenticado:
    * Título: "INMATE LOOKUP PORTAL"
    * Subtítulo: "Find your relative to request a standard or conjugal visit."
    * Sin botón de acción
  
  - Usuario autenticado (admin):
    * Título: "WARDEN CONTROL PANEL"
    * Subtítulo: "Prison Population Management"
    * Botón "CREATE PRISONER" visible (emite evento 'create')
  
  Eventos emitidos:
  - create: Se dispara cuando el admin hace clic en el botón CREATE PRISONER
  
  Dependencias:
  - authStore: Para determinar el estado de autenticación
-->

<template>
    <section class="banner-wrapper">
        <div class="container">
            <div class="banner-box" :class="{ 'admin-banner': authStore.isAuthenticated }">
                <div class="banner-content">
                    <div class="banner-text">
                        <h1 class="banner-title" :class="{ 'admin-title': authStore.isAuthenticated }">
                            {{ authStore.isAuthenticated ? 'WARDEN CONTROL PANEL' : 'INMATE LOOKUP PORTAL' }}
                        </h1>
                        <p class="banner-subtitle">
                            {{ authStore.isAuthenticated ? 'Prison Population Management' : 'Find your relative to request a standard or conjugal visit.' }}
                        </p>
                    </div>
                    <!-- Botón solo visible para usuarios autenticados -->
                    <button v-if="authStore.isAuthenticated" @click="$emit('create')" class="btn-create-banner">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                        </svg>
                        CREATE PRISONER
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { authStore } from '../store/auth.js';

// Definir eventos que este componente puede emitir
defineEmits(['create']);
</script>

<style scoped>
        /* --- ESTILOS NUEVO CARTEL / BANNER --- */
        /* Contenedor solo para padding y alineación */
        .banner-wrapper {
            padding: 0.5rem 1rem;
            width: 100%;
        }

        /* La caja del cartel propiamente dicha */
        .banner-box {
            border: 3px solid white; /* Borde blanco sólido característico */
            padding: 2rem 1rem;
            background-color: #1a1a1a; 
            max-width: 900px;
            margin: 0 auto; 
            box-shadow: 0 10px 20px rgba(0,0,0,0.5);
        }

        .banner-box.admin-banner {
            background-color: #30343b; /* Azul grisáceo metálico mate para admin */
        }

        .banner-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 2rem;
        }

        .banner-text {
            flex: 1;
            text-align: center;
        }

        .btn-create-banner {
            background-color: #ff5e00;
            color: #000;
            border: 3px solid #000;
            padding: 1rem 1.5rem;
            font-weight: bold;
            text-transform: uppercase;
            cursor: pointer;
            box-shadow: 4px 4px 0px #000;
            transition: all 0.1s;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1rem;
            letter-spacing: 1px;
            white-space: nowrap;
        }

        .btn-create-banner:hover {
            background-color: #e54e00;
            transform: translate(2px, 2px);
            box-shadow: 2px 2px 0px #000;
        }

        .btn-create-banner:active {
            transform: translate(4px, 4px);
            box-shadow: 0px 0px 0px #000;
        }

        .banner-title {
            color: #ff5e00; /* Mismo naranja institucional */
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
            font-weight: 800;
            text-transform: uppercase;
            font-size: 2.2rem;
            letter-spacing: 2px;
            margin-bottom: 0.8rem;
            line-height: 1.1;
        }

        .banner-title.admin-title {
            color: #dc3545; /* Rojo para modo admin */
        }

        .banner-subtitle {
            color: #e0e0e0;
            /* Usamos Courier para un toque técnico/documento pero legible */
            font-family: 'Courier New', Courier, monospace; 
            font-size: 1rem;
            margin: 0;
            letter-spacing: 0.5px;
        }

        @media (max-width: 768px) {
            .banner-content {
                flex-direction: column;
                text-align: center;
            }

            .btn-create-banner {
                width: 100%;
                justify-content: center;
            }
        }
</style>