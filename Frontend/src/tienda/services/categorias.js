import api from "./api";

/**
 * Servicios para interactuar con el endpoint de categorías de la API
 */

export async function getCategorias() {
    const res = await api.get("/api/categorias");
    return res.data;
}

export async function getCategoriaById(id) {
    const res = await api.get(`/api/categorias/${id}`);
    return res.data;
}

export async function createCategoria(data) {
    const res = await api.post("/api/categorias", data);
    return res.data;
}

export async function updateCategoria(id, data) {
    const res = await api.patch(`/api/categorias/${id}`, data);
    return res.data;
}

export async function deleteCategoria(id) {
    await api.delete(`/api/categorias/${id}`);
}