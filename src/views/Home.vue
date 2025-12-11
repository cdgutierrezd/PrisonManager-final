<!--
  VISTA: HOME (PÁGINA PRINCIPAL)
  
  Vista principal de la aplicación que muestra el directorio de prisioneros.
  Adaptable según el estado de autenticación del usuario.
  
  Características:
  - Grid responsivo de 3 columnas con tarjetas de prisioneros
  - Renderizado condicional de funcionalidades según autenticación:
    * Usuario no autenticado: Solo visualización + botón "REQUEST VISIT"
    * Usuario autenticado: Botones EDIT/DELETE + botón CREATE en banner
  
  Modales incluidos:
  1. Modal de confirmación de eliminación (custom)
  2. Modal de edición (componente SavePrisioner)
  3. Modal de creación (componente SavePrisioner reutilizado)
  
  Operaciones CRUD:
  - CREATE: saveCreate() → save() → actualiza lista
  - READ: onMounted() → findAll() → prisioners
  - UPDATE: saveEdit() → update() → actualiza lista
  - DELETE: confirmDelete() → deleteById() → actualiza lista
  
  Flujo de datos:
  - Los datos se cargan al montar el componente
  - Cada operación CRUD refresca la lista completa desde la API
  - El estado de autenticación se verifica en onMounted
  
  Componentes utilizados:
  - HeaderNav: Navegación superior
  - BannerHome: Banner con botón CREATE (emite evento 'create')
  - PrisionerCard: Tarjetas individuales (emiten eventos 'edit' y 'delete')
  - SavePrisioner: Modal reutilizable para crear/editar
-->

<template>
  <HeaderNav></HeaderNav>
  <BannerHome @create="showCreateModal = true"></BannerHome>
  
  <!-- Grid de tarjetas de prisioneros (3 columnas) -->
  <main class="container py-5">
    <div class="row g-2 justify-content-center p-1" style="max-width: 900px; margin: 0 auto;">
      <div v-for="p in prisioners" :key="p.id"
           class="col-lg-4 d-flex align-items-stretch">
        <PrisionerCard
          :img="p.img"
          :id="p.id"
          :name="p.name"
          :danger="p.danger"
          :crime="p.crime"
          :conviction="p.conviction"
          :description="p.description"
          :isAuthenticated="authStore.isAuthenticated"
          @delete="openDeleteModal"
          @edit="handleEdit"
        />
      </div>
    </div>
  </main>

  <!-- Modal de confirmación de eliminación -->
  <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
    <div class="modal-box" @click.stop>
      <div class="modal-header">
        <h2>CONFIRM DELETE</h2>
      </div>
      <div class="modal-body">
        <p>Are you sure you want to delete prisoner <strong>{{ prisonerToDelete?.name }}</strong>?</p>
        <p class="text-danger">This action cannot be undone.</p>
      </div>
      <div class="modal-footer">
        <button @click="showDeleteModal = false" class="btn-cancel">
          <i class="bi bi-x-circle me-1"></i>
          CANCEL
        </button>
        <button @click="confirmDelete" class="btn-confirm-delete">
          <i class="bi bi-trash3 me-1"></i>
          DELETE
        </button>
      </div>
    </div>
  </div>

  <!-- Modal de edición (reutiliza componente SavePrisioner) -->
  <SavePrisioner
    :show="showEditModal"
    :prisoner="editingPrisoner"
    title="EDIT PRISONER"
    buttonText="SAVE CHANGES"
    @close="showEditModal = false"
    @save="saveEdit"
  />

  <!-- Modal de creación (reutiliza componente SavePrisioner con prisoner=null) -->
  <SavePrisioner
    :show="showCreateModal"
    :prisoner="null"
    title="CREATE PRISONER"
    buttonText="CREATE"
    @close="showCreateModal = false"
    @save="saveCreate"
  />

  <!-- Modal de confirmación de operación exitosa -->
  <SuccessModal
    :show="showSuccessModal"
    :message="successMessage"
    @close="showSuccessModal = false"
  />
</template>

<script setup>
import HeaderNav from '../components/HeaderNav.vue';
import BannerHome from '../components/BannerHome.vue';
import SavePrisioner from '../components/SavePrisioner.vue';
import SuccessModal from '../components/SuccessModal.vue';
import { ref, onMounted } from 'vue'
import { findAll, deleteById, update, save } from '../services/prisionerService.js'
import PrisionerCard from '../components/PrisionerCard.vue';
import { authStore } from '../store/auth.js';

// Estado reactivo: lista de prisioneros
const prisioners = ref([])

// Estados de visibilidad de modales
const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const showEditModal = ref(false)
const showSuccessModal = ref(false)

// Estados para operaciones
const prisonerToDelete = ref(null)
const successMessage = ref('')
const editingPrisoner = ref({
  id: '',
  name: '',
  img: '',
  danger: '',
  crime: '',
  conviction: '',
  description: ''
})

/**
 * Hook de ciclo de vida: Al montar el componente
 * Verifica autenticación y carga la lista de prisioneros
 */
onMounted(async () => { 
  authStore.checkAuth()
  prisioners.value = await findAll() 
})

/**
 * Abre el modal de confirmación de eliminación
 * @param {String} id - ID del prisionero a eliminar
 */
const openDeleteModal = (id) => {
  prisonerToDelete.value = prisioners.value.find(p => p.id === id)
  showDeleteModal.value = true
}

/**
 * Confirma y ejecuta la eliminación del prisionero
 * Actualiza la lista después de eliminar
 */
const confirmDelete = async () => {
  if (prisonerToDelete.value) {
    const name = prisonerToDelete.value.name
    await deleteById(prisonerToDelete.value.id)
    prisioners.value = await findAll()
    showDeleteModal.value = false
    prisonerToDelete.value = null
    successMessage.value = `Prisoner "${name}" deleted successfully!`
    showSuccessModal.value = true
  }
}

/**
 * Prepara y abre el modal de edición
 * @param {Object} prisoner - Datos del prisionero a editar
 */
const handleEdit = (prisoner) => {
  editingPrisoner.value = { ...prisoner }
  showEditModal.value = true
}

/**
 * Guarda los cambios de un prisionero editado
 * @param {Object} prisonerData - Datos actualizados del prisionero
 */
const saveEdit = async (prisonerData) => {
  await update(prisonerData.id, prisonerData)
  prisioners.value = await findAll()
  showEditModal.value = false
  successMessage.value = `Prisoner "${prisonerData.name}" updated successfully!`
  showSuccessModal.value = true
}

/**
 * Crea un nuevo prisionero en el sistema
 * @param {Object} prisonerData - Datos del nuevo prisionero
 */
const saveCreate = async (prisonerData) => {
  await save(prisonerData)
  prisioners.value = await findAll()
  showCreateModal.value = false
  successMessage.value = `Prisoner "${prisonerData.name}" created successfully!`
  showSuccessModal.value = true
}
</script>

<style scoped>
/* Modal de confirmación */
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
  max-width: 500px;
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

.modal-body p {
  margin-bottom: 1rem;
  font-size: 1rem;
}

.text-danger {
  color: #dc3545;
  font-weight: bold;
  font-size: 0.9rem;
}

.modal-footer {
  padding: 1rem 1.5rem;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  border-top: 2px solid #000;
}

.btn-cancel,
.btn-confirm-delete {
  padding: 0.7rem 1.5rem;
  font-size: 0.9rem;
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 0;
  border: 2px solid #000;
  cursor: pointer;
  box-shadow: 4px 4px 0px #000;
  transition: transform 0.1s, box-shadow 0.1s;
}

.btn-cancel {
  background-color: #6c757d;
  color: #fff;
}

.btn-cancel:hover {
  background-color: #5a6268;
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #000;
}

.btn-confirm-delete {
  background-color: #dc3545;
  color: #fff;
}

.btn-confirm-delete:hover {
  background-color: #c82333;
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #000;
}

.btn-cancel:active,
.btn-confirm-delete:active {
  transform: translate(4px, 4px);
  box-shadow: 0px 0px 0px #000;
}
</style>