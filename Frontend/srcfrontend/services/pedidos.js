import api from "./api";

/**
* Servicios para interactuar con el endpoint de pedidos de la API
*/

// Crear un nuevo pedido
export async function createPedido(data) {
    const res = await api.post("/pedidos", data);
    return res.data;
}

// Obtener un pedido por ID
export async function getPedidoById(id) {
    const res = await api.get(`/pedidos/${id}`);
    return res.data;
}

// Actualizar el estado de un pedido
export async function updatePedido(id, data) {
    const res = await api.patch(`/pedidos/${id}`, data);
    return res.data;
}

// Eliminar un pedido
export async function deletePedido(id) {
    await api.delete(`/pedidos/${id}`);
}

// Obtener todos los pedidos de un usuario por DNI
export async function getPedidosByUsuario(dni) {
    const res = await api.get(`/pedidos/usuario/${dni}`);
    return res.data;
}

