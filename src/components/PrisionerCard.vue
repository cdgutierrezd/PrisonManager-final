<!--
  COMPONENTE: TARJETA DE PRISIONERO
  
  Muestra la información detallada de un prisionero en formato de tarjeta.
  El diseño y funcionalidad se adaptan según el estado de autenticación.
  
  Props recibidas:
  - img: URL de la imagen del prisionero
  - id: Identificador único del prisionero
  - name: Nombre completo
  - danger: Nivel de peligrosidad
  - crime: Crimen cometido
  - conviction: Sentencia asignada
  - description: Descripción adicional o comentarios
  - isAuthenticated: Booleano que determina qué botones mostrar
  
  Comportamiento condicional:
  - Usuario no autenticado: Muestra botón "REQUEST VISIT" que abre el formulario de visita
  - Usuario autenticado: Muestra botones "EDIT" y "DELETE" para administración
  
  Eventos emitidos:
  - edit: Emite los datos completos del prisionero para edición
  - delete: Emite el ID del prisionero a eliminar
  
  Componentes hijos:
  - VisitForm: Modal para solicitar visita (solo usuarios no autenticados)
-->

<template>
  <div class="card shadow-sm">
    <div class="position-relative image-wrapper">
      <img :src="img" class="card-img-top" :alt="`Foto de ${name}`">
    </div>

    <div class="id-section bg-dark bg-opacity-75 text-white text-center py-1 small">
      ID: P-0{{ id }}
    </div>

    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="card-title h4 mb-0 fw-bold">{{ name }}</h2>
        <span class="badge bg-warning text-dark">{{ danger }}</span>
      </div>

      <div class="mb-3">
        <p class="mb-1"><strong>CRIME:</strong> {{ crime }}</p>
        <p class="mb-0"><strong>SENTENCE:</strong> {{ conviction }}</p>
      </div>

      <div class="alert alert-light border mb-4 fst-italic text-muted">
        "{{ description }}"
      </div>

      <!-- Botones según autenticación -->
      <div v-if="!isAuthenticated">
        <!-- Botón para usuarios públicos -->
        <button @click="showVisitForm = true" class="btn btn-warning w-100 fw-bold">
          <i class="bi bi-calendar-check me-2"></i>
          REQUEST VISIT
        </button>
      </div>
      
      <div v-else class="admin-buttons">
        <!-- Botones para administradores -->
        <button @click="$emit('edit', { id, name, img, danger, crime, conviction, description })" class="btn-edit">
          <i class="bi bi-pencil-square me-1"></i>
          EDIT
        </button>
        <button @click="$emit('delete', id)" class="btn-delete">
          <i class="bi bi-trash3 me-1"></i>
          DELETE
        </button>
      </div>
    </div>
  </div>

  <!-- Modal de solicitud de visita (solo usuarios no autenticados) -->
  <VisitForm 
    :show="showVisitForm" 
    :prisonerName="name"
    @close="showVisitForm = false" 
  />
</template>

<script setup>
import { ref } from 'vue'
import VisitForm from './VisitForm.vue'

// Definir las props que recibe el componente
defineProps({
  img: String,
  id: String,
  name: String,
  danger: String,
  crime: String,
  conviction: String,
  description: String,
  isAuthenticated: Boolean
})

// Estado para controlar la visibilidad del modal de visita
const showVisitForm = ref(false)
</script>

<style scoped>
/* -------- contenedor y imagen -------- */
.image-wrapper {
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f3f5;
  padding: 0.6rem;
}

.card-img-top {
  width: 90% !important;
  height: 90% !important;
  aspect-ratio: 1 / 1 !important;
  object-fit: cover !important;
  border: 4px solid #000 !important;
  border-radius: 0 !important;
}

/* -------- tarjeta más pequeña -------- */
.card {
  width: 100% !important;
  margin: 0;
  font-size: 0.8rem !important;  /* texto reducido */
  border-radius: 0 !important;
  border: 3px solid #000 !important;
  background-color: #f3f3f5 !important;
}

/* -------- cuerpo compacto -------- */
.card-body {
  padding: 0.6rem !important;   /* menos relleno */
}

/* -------- títulos y badges -------- */
.card-title   { font-size: 1rem !important; }
.badge        { font-size: 0.7rem !important; border-radius: 0 !important; border: 2px solid #000 !important; padding: 0.4rem 0.6rem !important; }
.alert        { padding: 0.4rem 0.6rem !important; font-size: 0.8rem !important; border-radius: 0 !important; border: 2px solid #000 !important; }
.btn          { font-size: 0.85rem !important; padding: 0.3rem 0.5rem !important; }

/* -------- botón naranja personalizado -------- */
.btn-warning {
  background-color: #ff5e00 !important;
  border-color: #000 !important;
  border-width: 2px !important;
  color: #000 !important;
  border-radius: 0 !important;
  box-shadow: 6px 6px 0px #000;
  transition: transform 0.1s, box-shadow 0.1s, background-color 0.1s;
}

.btn-warning:hover {
  background-color: #e54e00 !important;
  border-color: #000 !important;
  color: #000 !important;
  transform: translate(2px, 2px);
  box-shadow: 4px 4px 0px #000;
}

.btn-warning:active {
  transform: translate(6px, 6px);
  box-shadow: 0px 0px 0px #000;
}

/* -------- botones de administración -------- */
.admin-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-edit,
.btn-delete {
  flex: 1;
  padding: 0.5rem;
  font-size: 0.85rem;
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 0;
  border: 2px solid #000;
  cursor: pointer;
  box-shadow: 6px 6px 0px #000;
  transition: transform 0.1s, box-shadow 0.1s, background-color 0.1s;
}

.btn-edit {
  background-color: #ff5e00;
  color: #000;
}

.btn-edit:hover {
  background-color: #e54e00;
  transform: translate(2px, 2px);
  box-shadow: 4px 4px 0px #000;
}

.btn-edit:active {
  transform: translate(6px, 6px);
  box-shadow: 0px 0px 0px #000;
}

.btn-delete {
  background-color: #dc3545;
  color: #fff;
}

.btn-delete:hover {
  background-color: #c82333;
  transform: translate(2px, 2px);
  box-shadow: 4px 4px 0px #000;
}

.btn-delete:active {
  transform: translate(6px, 6px);
  box-shadow: 0px 0px 0px #000;
}
</style>