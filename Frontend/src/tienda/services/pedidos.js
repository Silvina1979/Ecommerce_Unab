import api from "./api";

/**
 * Servicios para interactuar con el endpoint de pedidos de la API
 */

export async function createPedido(data) {
    const res = await api.post("/api/pedidos", data);
    return res.data;
}

export async function getPedidoById(id) {
    const res = await api.get(`/api/pedidos/${id}`);
    return res.data;
}

export async function updatePedido(id, data) {
    const res = await api.patch(`/api/pedidos/${id}`, data);
    return res.data;
}

export async function deletePedido(id) {
    await api.delete(`/api/pedidos/${id}`);
}

export async function getPedidosByUsuario(dni) {
    const res = await api.get(`/api/pedidos/usuario/${dni}`);
    return res.data;
}

