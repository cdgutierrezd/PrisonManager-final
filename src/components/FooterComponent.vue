<!--
  COMPONENTE: FOOTER
  
  Pie de página global de la aplicación.
  Se muestra en todas las vistas del sistema.
  
  Características:
  - Diseño centrado con ancho máximo de 900px
  - Borde superior naranja (#ff5e00) característico del tema
  - Texto con copyright de la prisión
  - Posicionamiento automático al final mediante flexbox del contenedor padre
-->

<template>
    <footer class="footer">
        <div class="footer-content">
            <p>&copy; 2025 Prison El Chapo</p>
        </div>
    </footer>
</template>

<style scoped>
.footer {
    background-color: #000;
    padding: 20px 0;
    margin-top: auto;
    width: 100%;
}

.footer-content {
    max-width: 900px;
    margin: 0 auto;
    text-align: center;
    color: #dcdde1;
}

.footer-content p {
    margin: 5px 0;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 1px;
}

.footer-content p:first-child {
    color: #ff5e00;
}
</style>
