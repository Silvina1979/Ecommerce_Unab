import api from "./api";

/**
 * Servicios para interactuar con el endpoint de carrito de la API
 * Permite agregar, listar y eliminar items del carrito de compras.
 */

/**
 * Agrega un producto al carrito del usuario
 * @param {string} nombreTienda - Slug de la tienda
 * @param {Object} data - { usuarioDni, productoId, cantidad }
 */
export async function agregarAlCarrito(nombreTienda, data) {
    const res = await api.post(`tiendas/${nombreTienda}/carrito/agregar`, data);
    return res.data;
}

/**
 * Obtiene el carrito completo de un usuario
 * @param {string} nombreTienda - Slug de la tienda
 * @param {number} usuarioDni - DNI del usuario
 */
export async function obtenerCarrito(nombreTienda, usuarioDni) {
    const res = await api.get(`tiendas/${nombreTienda}/carrito/${usuarioDni}`);
    return res.data;
}

/**
 * Elimina un item específico del carrito
 * @param {string} nombreTienda - Slug de la tienda
 * @param {number} idItem - ID del item en la base de datos (no el productoId)
 */
export async function eliminarItemCarrito(nombreTienda, idItem) {
    await api.delete(`tiendas/${nombreTienda}/carrito/item/${idItem}`);
}

/**
 * Vacía todo el carrito del usuario
 * @param {string} nombreTienda - Slug de la tienda
 * @param {number} usuarioDni - DNI del usuario
 */
export async function vaciarCarrito(nombreTienda, usuarioDni) {
    await api.delete(`tiendas/${nombreTienda}/carrito/vaciar/${usuarioDni}`);
}