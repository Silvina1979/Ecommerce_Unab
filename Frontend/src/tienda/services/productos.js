import api from "./api";

/**
 * Servicios para interactuar con el endpoint de productos de la API
 */

export async function getProductos() {
    const res = await api.get("/api/productos");
    return res.data;
}

export async function getProductoById(id) {
    const res = await api.get(`/api/productos/${id}`);
    return res.data;
}

export async function createProducto(data) {
    const res = await api.post("/api/productos", data);
    return res.data;
}

export async function updateProducto(id, data) {
    const res = await api.patch(`/api/productos/${id}`, data);
    return res.data;
}

export async function deleteProducto(id) {
    await api.delete(`/api/productos/${id}`);
}
