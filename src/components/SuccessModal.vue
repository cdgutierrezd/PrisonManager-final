
<!--
  COMPONENTE: MODAL DE CONFIRMACIÓN DE ÉXITO
  
  Modal reutilizable que muestra mensajes de confirmación para operaciones exitosas.
  Se utiliza para notificar al usuario después de crear, actualizar o eliminar registros.
  
  Props recibidas:
  - show: Boolean que controla la visibilidad del modal
  - message: String con el mensaje de éxito a mostrar
  
  Características:
  - Diseño consistente con el tema de la aplicación
  - Fondo verde indicando éxito
  - Icono de check de Bootstrap Icons
  - Botón OK para cerrar
  - Cierra al hacer clic en el overlay o botón
  
  Eventos emitidos:
  - close: Se dispara al cerrar el modal
  
  Uso:
  <SuccessModal 
    :show="showSuccess" 
    :message="'User created successfully!'"
    @close="showSuccess = false" 
  />
-->

<template>
  <div v-if="show" class="modal-overlay" @click="$emit('close')">
    <div class="modal-box modal-success" @click.stop>
      <div class="modal-header success-header">
        <h2><i class="bi bi-check-circle-fill me-2"></i>SUCCESS</h2>
      </div>
      <div class="modal-body">
        <p class="success-message">{{ message }}</p>
      </div>
      <div class="modal-footer">
        <button @click="$emit('close')" class="btn-ok">
          <i class="bi bi-check-lg me-1"></i>
          OK
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Definir props del componente
defineProps({
  show: {
    type: Boolean,
    required: true
  },
  message: {
    type: String,
    required: true
  }
})

// Definir eventos que puede emitir
defineEmits(['close'])
</script>

<style scoped>
/* Modal overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-box {
  background-color: #dcdde1;
  border: 4px solid #000;
  border-radius: 0;
  width: 90%;
  box-shadow: 10px 10px 0px #000;
}

.modal-header {
  background-color: #1a1a1a;
  color: #fff;
  padding: 1.5rem;
  border-bottom: 3px solid #000;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.modal-body {
  padding: 2rem 1.5rem;
  color: #000;
}

/* Estilos específicos del modal de éxito */
.modal-success {
  max-width: 400px;
}

.success-header {
  background-color: #28a745;
  color: #fff;
}

.success-message {
  font-size: 1.1rem;
  font-weight: 600;
  color: #28a745;
  text-align: center;
  margin: 1.5rem 0;
}

.modal-footer {
  padding: 1rem 1.5rem;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  border-top: 2px solid #000;
}

.btn-ok {
  background-color: #28a745;
  color: #fff;
  border: 3px solid #000;
  padding: 0.75rem 2rem;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 4px 4px 0px #000;
  transition: all 0.1s;
  width: 100%;
}

.btn-ok:hover {
  background-color: #218838;
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #000;
}

.btn-ok:active {
  transform: translate(4px, 4px);
  box-shadow: 0px 0px 0px #000;
}
</style>
