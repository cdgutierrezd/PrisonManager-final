/**
 * SERVICIO DE USUARIOS
 * 
 * Gestiona las operaciones relacionadas con usuarios del sistema, incluyendo
 * autenticación y operaciones CRUD sobre la entidad User.
 * 
 * Endpoint base: https://6925dcd182b59600d7257f2e.mockapi.io/api/users
 * 
 * Funciones disponibles:
 * - login(username, password): Autentica un usuario
 * - findAllUsers(): Obtiene todos los usuarios
 * - saveUser(user): Crea un nuevo usuario
 * - updateUser(id, user): Actualiza un usuario existente
 * - deleteUserById(id): Elimina un usuario
 */

import axios from 'axios'

// Cliente HTTP configurado con la URL base de MockAPI
const api = axios.create({
  baseURL: 'https://6925dcd182b59600d7257f2e.mockapi.io/api'
})

/**
 * Autentica un usuario verificando sus credenciales
 * Obtiene todos los usuarios y busca coincidencia con username y password
 * @param {String} username - Nombre de usuario
 * @param {String} password - Contraseña del usuario
 * @returns {Promise<Object|null>} Objeto usuario si las credenciales son válidas, null si no
 * @throws {Error} Si hay un error de conexión con la API
 */
export async function login(username, password) {
  try {
    const { data } = await api.get('/users')
    const user = data.find(u => u.username === username && u.password === password)
    return user || null
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

/**
 * Obtiene la lista completa de usuarios registrados
 * @returns {Promise<Array>} Lista de objetos usuario
 */
export async function findAllUsers() {
  const { data } = await api.get('/users')
  return data
}

/**
 * Crea un nuevo usuario en el sistema
 * @param {Object} user - Datos del usuario a crear (username, password)
 * @returns {Promise<Object>} Usuario creado con su ID asignado
 */
export async function saveUser(user) {
  return (await api.post('/users', user)).data
}

/**
 * Actualiza los datos de un usuario existente
 * @param {String} id - ID del usuario a actualizar
 * @param {Object} user - Nuevos datos del usuario
 * @returns {Promise<Object>} Usuario actualizado
 */
export async function updateUser(id, user) {
  return (await api.put(`/users/${id}`, user)).data
}

/**
 * Elimina un usuario del sistema
 * @param {String} id - ID del usuario a eliminar
 * @returns {Promise<Object>} Confirmación de eliminación
 */
export async function deleteUserById(id) {
  return (await api.delete(`/users/${id}`)).data
}