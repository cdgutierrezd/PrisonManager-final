
<!--
  VISTA: ADMINISTRACIÓN DE USUARIOS
  
  Panel exclusivo para administradores que permite gestionar los usuarios del sistema.
  Implementa operaciones CRUD completas sobre la entidad User.
  
  Protección de ruta:
  - Meta: requiresAuth (solo accesible si está autenticado)
  - Si el usuario no está autenticado, el router lo redirige a /login
  
  Características principales:
  - Tabla de usuarios con columnas: ID, USERNAME, PASSWORD, EMAIL, CITY, ACTIONS
  - Botón CREATE USER en el header
  - Acciones por fila: EDIT y DELETE
  - Modal reutilizable para crear/editar (detecta modo automáticamente)
  - Modal de confirmación para eliminación
  
  Operaciones CRUD:
  - CREATE: openCreateModal() → saveUser() con isEditing=false
  - READ: onMounted() → loadUsers() → findAllUsers()
  - UPDATE: openEditModal() → saveUser() con isEditing=true
  - DELETE: openDeleteModal() → confirmDelete() → deleteUserById()
  
  Estado del formulario:
  - isEditing: Determina si el modal está en modo crear o editar
  - formData: Datos reactivos del usuario (id, username, password, email, city)
  - showFormModal: Visibilidad del modal de formulario
  - showDeleteModal: Visibilidad del modal de confirmación
  
  Flujo de trabajo:
  1. Al montar, carga todos los usuarios
  2. Cada acción CRUD actualiza la lista completa
  3. Los modales se cierran automáticamente después de guardar
  
  Componentes utilizados:
  - HeaderNav: Barra de navegación superior
-->

<template>
  <HeaderNav />
  <div class="admin-container">
    <!-- Header con título y botón de crear -->
    <div class="admin-header">
      <h1>ADMIN MANAGEMENT</h1>
      <button @click="openCreateModal" class="btn-create">
        CREATE USER
      </button>
    </div>

    <!-- Tabla de usuarios -->
    <div class="users-table-container">
      <table class="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>USERNAME</th>
            <th>PASSWORD</th>
            <th>EMAIL</th>
            <th>CITY</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.password }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.city }}</td>
            <td class="actions-cell">
              <button @click="openEditModal(user)" class="btn-action btn-edit-action">
                <i class="bi bi-pencil-square me-1"></i>
                EDIT
              </button>
              <button @click="openDeleteModal(user)" class="btn-action btn-delete-action">
                <i class="bi bi-trash3 me-1"></i>
                DELETE
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal para crear/editar usuario -->
    <div v-if="showFormModal" class="modal-overlay" @click="closeFormModal">
      <div class="modal-box" @click.stop>
        <button @click="closeFormModal" class="btn-close-modal">✕</button>
        <div class="modal-header">
          <!-- Título dinámico según el modo -->
          <h2>{{ isEditing ? '✏️ EDIT USER' : '➕ CREATE USER' }}</h2>
        </div>
        <form @submit.prevent="saveUser" class="user-form">
          <div class="form-group">
            <label>USERNAME</label>
            <input type="text" v-model="formData.username" required class="form-input">
          </div>
          
          <div class="form-group">
            <label>PASSWORD</label>
            <input type="text" v-model="formData.password" required class="form-input">
          </div>

          <div class="form-group">
            <label>EMAIL</label>
            <input type="email" v-model="formData.email" required class="form-input">
          </div>

          <div class="form-group">
            <label>CITY</label>
            <input type="text" v-model="formData.city" required class="form-input">
          </div>

          <div class="modal-footer">
            <!-- Texto dinámico del botón según el modo -->
            <button type="submit" class="btn-save">
              {{ isEditing ? 'SAVE CHANGES' : 'CREATE USER' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
      <div class="modal-box modal-delete" @click.stop>
        <div class="modal-header">
          <h2>⚠️ CONFIRM DELETE</h2>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete user <strong>{{ userToDelete?.username }}</strong>?</p>
          <p class="text-danger">This action cannot be undone.</p>
        </div>
        <div class="modal-footer">
          <button @click="showDeleteModal = false" class="btn-cancel">
            CANCEL
          </button>
          <button @click="confirmDelete" class="btn-confirm-delete">
            DELETE
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación de operación exitosa -->
    <SuccessModal
      :show="showSuccessModal"
      :message="successMessage"
      @close="showSuccessModal = false"
    />
  </div>
</template>

<script setup>
import HeaderNav from '../components/HeaderNav.vue'
import SuccessModal from '../components/SuccessModal.vue'
import { ref, onMounted } from 'vue'
import { findAllUsers, saveUser as createUser, updateUser, deleteUserById } from '../services/usersService.js'

// Estado reactivo: lista de usuarios
const users = ref([])

// Estados de visibilidad de modales
const showFormModal = ref(false)
const showDeleteModal = ref(false)
const showSuccessModal = ref(false)

// Estados de operación
const isEditing = ref(false) // Determina si estamos creando o editando
const userToDelete = ref(null)
const successMessage = ref('')

// Datos del formulario
const formData = ref({
  id: '',
  username: '',
  password: '',
  email: '',
  city: ''
})

/**
 * Hook de ciclo de vida: Al montar el componente
 * Carga la lista inicial de usuarios
 */
onMounted(async () => {
  await loadUsers()
})

/**
 * Carga todos los usuarios desde la API
 */
const loadUsers = async () => {
  users.value = await findAllUsers()
}

/**
 * Abre el modal en modo creación
 * Limpia el formulario y establece isEditing en false
 */
const openCreateModal = () => {
  isEditing.value = false
  formData.value = {
    id: '',
    username: '',
    password: '',
    email: '',
    city: ''
  }
  showFormModal.value = true
}

/**
 * Abre el modal en modo edición
 * Pre-llena el formulario con los datos del usuario
 * @param {Object} user - Usuario a editar
 */
const openEditModal = (user) => {
  isEditing.value = true
  formData.value = { ...user }
  showFormModal.value = true
}

/**
 * Cierra el modal de formulario
 */
const closeFormModal = () => {
  showFormModal.value = false
}

/**
 * Guarda el usuario (crear o actualizar según isEditing)
 * Refresca la lista y cierra el modal
 */
const saveUser = async () => {
  try {
    if (isEditing.value) {
      // Modo edición: actualizar usuario existente
      await updateUser(formData.value.id, formData.value)
      successMessage.value = `User "${formData.value.username}" updated successfully!`
    } else {
      // Modo creación: crear nuevo usuario
      await createUser(formData.value)
      successMessage.value = `User "${formData.value.username}" created successfully!`
    }
    await loadUsers()
    closeFormModal()
    showSuccessModal.value = true
  } catch (error) {
    console.error('Error saving user:', error)
  }
}

/**
 * Abre el modal de confirmación de eliminación
 * @param {Object} user - Usuario a eliminar
 */
const openDeleteModal = (user) => {
  userToDelete.value = user
  showDeleteModal.value = true
}

/**
 * Confirma y ejecuta la eliminación del usuario
 * Actualiza la lista y cierra el modal
 */
const confirmDelete = async () => {
  if (userToDelete.value) {
    const username = userToDelete.value.username
    await deleteUserById(userToDelete.value.id)
    await loadUsers()
    showDeleteModal.value = false
    userToDelete.value = null
    successMessage.value = `User "${username}" deleted successfully!`
    showSuccessModal.value = true
  }
}
</script>

<style scoped>
.admin-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #1a1a1a;
  border: 4px solid #000;
  box-shadow: 8px 8px 0px #000;
}

.admin-header h1 {
  color: #ff5e00;
  font-size: 2rem;
  font-weight: bold;
  text-transform: uppercase;
  margin: 0;
  letter-spacing: 2px;
}

.btn-create {
  background-color: #ff5e00;
  color: #000;
  border: 3px solid #000;
  padding: 0.75rem 1.5rem;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 4px 4px 0px #000;
  transition: all 0.1s;
  font-size: 1rem;
}

.btn-create:hover {
  background-color: #e54e00;
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #000;
}

.btn-create:active {
  transform: translate(4px, 4px);
  box-shadow: 0px 0px 0px #000;
}

/* Tabla */
.users-table-container {
  background-color: #dcdde1;
  border: 4px solid #000;
  box-shadow: 8px 8px 0px #000;
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table thead {
  background-color: #1a1a1a;
  color: #fff;
}

.users-table th {
  padding: 1rem;
  text-align: left;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 3px solid #000;
}

.users-table td {
  padding: 1rem;
  border-bottom: 2px solid #000;
  font-family: 'Courier New', monospace;
}

.users-table tbody tr:hover {
  background-color: #f3f3f5;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  padding: 0.5rem 1rem;
  border: 2px solid #000;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  font-size: 0.85rem;
  box-shadow: 2px 2px 0px #000;
  transition: all 0.1s;
}

.btn-edit-action {
  background-color: #ffc107;
  color: #000;
}

.btn-edit-action:hover {
  background-color: #e0a800;
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0px #000;
}

.btn-delete-action {
  background-color: #dc3545;
  color: #fff;
}

.btn-delete-action:hover {
  background-color: #c82333;
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0px #000;
}

/* Modal */
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
  max-width: 500px;
  box-shadow: 10px 10px 0px #000;
  position: relative;
}

.modal-delete {
  max-width: 500px;
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

.modal-body {
  padding: 1.5rem;
}

.modal-body p {
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.text-danger {
  color: #dc3545;
  font-weight: bold;
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

/* Formulario */
.user-form {
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

.btn-cancel {
  background-color: #6c757d;
  color: #fff;
  border: 3px solid #000;
  padding: 0.75rem 1.5rem;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 4px 4px 0px #000;
  transition: all 0.1s;
}

.btn-cancel:hover {
  background-color: #5a6268;
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #000;
}

.btn-confirm-delete {
  background-color: #dc3545;
  color: #fff;
  border: 3px solid #000;
  padding: 0.75rem 1.5rem;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 4px 4px 0px #000;
  transition: all 0.1s;
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
