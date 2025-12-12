
<!--
  COMPONENTE: FORMULARIO DE SOLICITUD DE VISITA
  
  Modal con formulario para que usuarios no autenticados soliciten visitas a prisioneros.
  Este formulario es únicamente informativo y no persiste datos en la API.
  
  Props recibidas:
  - show: Boolean que controla la visibilidad del modal
  - prisonerName: Nombre del prisionero al que se desea visitar (para contexto)
  
  Características:
  - 3 campos de entrada: nombre del visitante, relación, razón de la visita
  - Limpieza automática del formulario al cerrar
  - Validación de campos requeridos con HTML5
  - No realiza persistencia de datos (solo simulación de envío)
  
  Eventos emitidos:
  - close: Se dispara al enviar el formulario o cerrar el modal
  
  Uso:
  - Exclusivo para usuarios no autenticados
  - Se muestra desde PrisionerCard al hacer clic en "REQUEST VISIT"
-->

<template>
  <div v-if="show" class="modal-overlay" @click="$emit('close')">
    <div class="modal-box visit-modal" @click.stop>
      <!-- Botón de cierre -->
      <button @click="$emit('close')" class="btn-close-modal">✕</button>
      
      <div class="modal-header">
        <h2>📋 REQUEST VISIT</h2>
      </div>
      
      <form @submit.prevent="handleSubmit" class="visit-form">
        <!-- Campo: Nombre del visitante -->
        <div class="form-group">
          <label>YOUR NAME</label>
          <input type="text" v-model="formData.name" required class="form-input" placeholder="Enter your full name">
        </div>
        
        <!-- Campo: Relación con el prisionero -->
        <div class="form-group">
          <label>RELATIONSHIP</label>
          <input type="text" v-model="formData.relationship" required class="form-input" placeholder="e.g., Family, Friend, Lawyer">
        </div>
        
        <!-- Campo: Razón de la visita -->
        <div class="form-group">
          <label>REASON FOR VISIT</label>
          <textarea v-model="formData.reason" required class="form-input" rows="3" placeholder="Explain the purpose of your visit"></textarea>
        </div>

        <div class="modal-footer">
          <button type="submit" class="btn-submit">
            SUBMIT REQUEST
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// Definir props del componente
const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  prisonerName: {
    type: String,
    default: ''
  }
})

// Definir eventos que puede emitir
const emit = defineEmits(['close'])

// Estado del formulario
const formData = ref({
  name: '',
  relationship: '',
  reason: ''
})

/**
 * Watcher: Limpiar formulario cuando se cierra el modal
 * Resetea todos los campos a valores vacíos
 */
watch(() => props.show, (newValue) => {
  if (!newValue) {
    formData.value = {
      name: '',
      relationship: '',
      reason: ''
    }
  }
})

/**
 * Maneja el envío del formulario
 * Nota: No persiste datos, solo cierra el modal
 * En una implementación real, aquí se enviarían los datos a un endpoint
 */
const handleSubmit = () => {
  // Cerrar modal sin mostrar alerta ni persistir datos
  emit('close')
}
</script>

<style scoped>
/* Modal overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
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
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: bold;
  text-transform: uppercase;
}

.prisoner-name {
  margin: 0;
  color: #ff5e00;
  font-size: 1rem;
  font-weight: bold;
}

.visit-modal {
  max-width: 500px;
  overflow: visible;
  position: relative;
}

.btn-close-modal {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 35px;
  height: 35px;
  background-color: #dc3545;
  color: white;
  border: 3px solid #000;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  box-shadow: 3px 3px 0px #000;
  transition: all 0.1s;
}

.btn-close-modal:hover {
  background-color: #c82333;
  transform: translate(1px, 1px);
  box-shadow: 2px 2px 0px #000;
}

.btn-close-modal:active {
  transform: translate(3px, 3px);
  box-shadow: 0px 0px 0px #000;
}

.visit-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.4rem;
  color: #000;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 1px;
}

.form-input {
  width: 100%;
  padding: 0.6rem;
  border: 2px solid #000;
  border-radius: 0;
  background-color: #fff;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  background-color: #fffacd;
  box-shadow: 3px 3px 0px rgba(0,0,0,0.3);
}

.form-input::placeholder {
  color: #999;
  font-style: italic;
}

textarea.form-input {
  resize: vertical;
  min-height: 80px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 0;
  border-top: none;
  margin-top: 1rem;
}

.btn-submit {
  width: 100%;
  background-color: #ff5e00;
  color: #000;
  border: 3px solid #000;
  padding: 0.75rem 1.5rem;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 4px 4px 0px #000;
  transition: all 0.1s;
}

.btn-submit:hover {
  background-color: #e54e00;
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #000;
}

.btn-submit:active {
  transform: translate(4px, 4px);
  box-shadow: 0px 0px 0px #000;
}
</style>
