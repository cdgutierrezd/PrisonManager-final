<!--
  COMPONENTE RAÍZ DE LA APLICACIÓN
  
  Este es el componente principal que envuelve toda la aplicación.
  Estructura:
  - router-view: Renderiza dinámicamente los componentes según la ruta actual
  - FooterComponent: Pie de página visible en todas las vistas
  
  El contenedor principal (#app) utiliza flexbox para mantener el footer
  siempre al final de la página, incluso cuando el contenido es corto.
-->

<script setup>
import FooterComponent from './components/FooterComponent.vue';
</script>

<template>
  <div id="app">
    <!-- Vista dinámica que cambia según la ruta actual -->
    <router-view />
    
    <!-- Footer visible en todas las páginas -->
    <FooterComponent />
  </div>
</template>

<style>
/* reset */
html, body, #app {
  margin: 0;
  padding: 0;
  min-height: 100vh;
}
/* fondo que SIEMPRE cubra todo */
#app {
  display: flex;
  flex-direction: column;
  background: repeating-linear-gradient(
    0deg,
    #0b0b0b 0 6px,
    #000     6px 12px
  );
}
</style>