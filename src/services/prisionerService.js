/**
 * SERVICIO DE PRISIONEROS
 * 
 * Proporciona funciones para realizar operaciones CRUD sobre la entidad Prisoner
 * a través de la API de MockAPI. Todas las funciones son asíncronas y retornan promesas.
 * 
 * Endpoint base: https://6925dcd182b59600d7257f2e.mockapi.io/api/prisoners
 * 
 * Funciones disponibles:
 * - findAll(): Obtiene la lista completa de prisioneros
 * - save(prisioner): Crea un nuevo prisionero
 * - update(id, prisioner): Actualiza los datos de un prisionero existente
 * - deleteById(id): Elimina un prisionero por su ID
 */

import axios from 'axios'

// Configuración del cliente HTTP con la URL base de MockAPI
const api = axios.create({
  baseURL: 'https://6925dcd182b59600d7257f2e.mockapi.io/api'
})

/**
 * Obtiene todos los prisioneros registrados
 * @returns {Promise<Array>} Lista de objetos prisoner
 */
export async function findAll() {
  const { data } = await api.get('/prisoners')
  return data
}

/**
 * Crea un nuevo registro de prisionero
 * @param {Object} prisioner - Datos del prisionero a crear
 * @returns {Promise<Object>} Prisionero creado con su ID asignado
 */
export async function save(prisioner){
    return (await api.post('/prisoners', prisioner)).data
}

/**
 * Actualiza los datos de un prisionero existente
 * @param {String} id - ID del prisionero a actualizar
 * @param {Object} prisioner - Nuevos datos del prisionero
 * @returns {Promise<Object>} Prisionero actualizado
 */
export async function update(id, prisioner){ 
    return (await api.put(`/prisoners/${id}`, prisioner)).data 
}

/**
 * Elimina un prisionero del sistema
 * @param {String} id - ID del prisionero a eliminar
 * @returns {Promise<Object>} Confirmación de eliminación
 */
export async function deleteById(id){ 
    return (await api.delete(`/prisoners/${id}`)).data 
}