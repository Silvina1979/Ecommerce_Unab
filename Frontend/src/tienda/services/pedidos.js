import api from "./api";

/**
 * Servicios para interactuar con el endpoint de pedidos de la API
 */

export async function createPedido(data) {
    const res = await api.post("pedidos", data);
    return res.data;
}

export async function getPedidoById(id) {
    const res = await api.get(`pedidos/${id}`);
    return res.data;
}

export async function updatePedido(id, data) {
    const res = await api.patch(`pedidos/${id}`, data);
    return res.data;
}

export async function deletePedido(id) {
    await api.delete(`pedidos/${id}`);
}

export async function getPedidosByUsuario(dni) {
    const res = await api.get(`pedidos/usuario/${dni}`);
    return res.data;
}

