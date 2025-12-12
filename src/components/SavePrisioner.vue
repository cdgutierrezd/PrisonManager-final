<!--
  COMPONENTE: MODAL REUTILIZABLE PARA CREAR/EDITAR PRISIONERO
  
  Modal con formulario que sirve tanto para crear nuevos prisioneros
  como para editar los existentes, según las props recibidas.
  
  Props recibidas:
  - show: Boolean que controla la visibilidad del modal
  - prisoner: Objeto con datos del prisionero (null para crear, objeto para editar)
  - title: Título del modal (por defecto: "EDIT PRISONER")
  - buttonText: Texto del botón de guardar (por defecto: "SAVE CHANGES")
  
  Comportamiento:
  - Si prisoner es null: Modo creación (formulario vacío)
  - Si prisoner tiene datos: Modo edición (formulario pre-llenado)
  
  Funcionalidades:
  - Formulario con 6 campos: nombre, nivel de peligro, crimen, sentencia, URL de imagen, descripción
  - Limpieza automática del formulario después de crear o cerrar
  - Validación de campos requeridos con HTML5
  
  Eventos emitidos:
  - close: Se dispara al cerrar el modal (clic en overlay o botón X)
  - save: Se dispara al enviar el formulario, emite los datos del prisionero
  
  Watchers:
  - Observa cambios en la prop prisoner para actualizar el formulario
  - Observa cambios en show para limpiar el formulario al cerrar
-->

<template>
  <div v-if="show" class="modal-overlay" @click="$emit('close')">
    <div class="modal-box modal-edit" @click.stop>
      <!-- Botón de cierre -->
      <button @click="$emit('close')" class="btn-close-modal">✕</button>
      
      <div class="modal-header">
        <h2>{{ title }}</h2>
      </div>
      
      <form @submit.prevent="handleSubmit" class="edit-form">
        <!-- Primera fila: Nombre y Nivel de peligro -->
        <div class="form-row">
          <div class="form-group">
            <label>NAME</label>
            <input type="text" v-model="formData.name" required class="form-input">
          </div>
          
          <div class="form-group">
            <label>DANGER LEVEL</label>
            <input type="text" v-model="formData.danger" required class="form-input">
          </div>
        </div>
        
        <!-- Segunda fila: Crimen y Sentencia -->
        <div class="form-row">
          <div class="form-group">
            <label>CRIME</label>
            <input type="text" v-model="formData.crime" required class="form-input">
          </div>
          
          <div class="form-group">
            <label>SENTENCE</label>
            <input type="text" v-model="formData.conviction" required class="form-input">
          </div>
        </div>
        
        <!-- Campo completo: URL de imagen -->
        <div class="form-group">
          <label>IMAGE URL</label>
          <input type="text" v-model="formData.img" required class="form-input">
        </div>
        
        <!-- Campo completo: Descripción -->
        <div class="form-group">
          <label>DESCRIPTION</label>
          <textarea v-model="formData.description" required class="form-input" rows="2"></textarea>
        </div>

        <div class="modal-footer">
          <button type="submit" class="btn-save">
            {{ buttonText }}
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
  prisoner: {
    type: Object,
    default: null // null = modo crear, objeto = modo editar
  },
  title: {
    type: String,
    default: 'EDIT PRISONER'
  },
  buttonText: {
    type: String,
    default: 'SAVE CHANGES'
  }
})

// Definir eventos que puede emitir
const emit = defineEmits(['close', 'save'])

// Estado del formulario
const formData = ref({
  id: '',
  name: '',
  img: '',
  danger: '',
  crime: '',
  conviction: '',
  description: ''
})

/**
 * Watcher: Actualizar formData cuando cambie la prop prisoner
 * Si prisoner tiene datos, llenar el formulario para edición
 * Si prisoner es null, limpiar el formulario para creación
 */
watch(() => props.prisoner, (newPrisoner) => {
  if (newPrisoner) {
    formData.value = { ...newPrisoner }
  } else {
    // Limpiar formulario para crear nuevo
    formData.value = {
      id: '',
      name: '',
      img: '',
      danger: '',
      crime: '',
      conviction: '',
      description: ''
    }
  }
}, { immediate: true })

/**
 * Watcher: Limpiar formulario cuando se cierre el modal
 * Solo en modo creación (cuando no hay prisoner)
 */
watch(() => props.show, (newValue) => {
  if (!newValue && !props.prisoner) {
    formData.value = {
      id: '',
      name: '',
      img: '',
      danger: '',
      crime: '',
      conviction: '',
      description: ''
    }
  }
})

/**
 * Maneja el envío del formulario
 * Emite el evento 'save' con los datos del prisionero
 * Limpia el formulario después de guardar si está en modo crear
 */
const handleSubmit = () => {
  emit('save', { ...formData.value })
  
  // Limpiar formulario después de guardar si es modo crear
  if (!props.prisoner) {
    formData.value = {
      id: '',
      name: '',
      img: '',
      danger: '',
      crime: '',
      conviction: '',
      description: ''
    }
  }
}
</script>

<style scoped>
/* Modal de edición */
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
}

.modal-edit {
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

.edit-form {
  padding: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
}

.form-group {
  margin-bottom: 0.8rem;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.3rem;
  color: #000;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 1px;
}

.form-input {
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #000;
  border-radius: 0;
  background-color: #fff;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  background-color: #fffacd;
  box-shadow: 3px 3px 0px rgba(0,0,0,0.3);
}

textarea.form-input {
  resize: vertical;
  min-height: 60px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 0;
  border-top: none;
}

.btn-save {
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

.btn-save:hover {
  background-color: #e54e00;
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #000;
}

.btn-save:active {
  transform: translate(4px, 4px);
  box-shadow: 0px 0px 0px #000;
}
</style>
