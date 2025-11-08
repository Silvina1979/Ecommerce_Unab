import api from "./api";

/**
* Servicios para interactuar con el endpoint de categorías de la API
*/

// Obtener todas las categorías
export async function getCategorias() {
    const res = await api.get("/categorias");
    return res.data;
}

// Obtener una categoría por su ID
export async function getCategoriaById(id) {
    const res = await api.get(`/categorias/${id}`);
    return res.data;
}

// Crear una nueva categoría
export async function createCategoria(data) {
    const res = await api.post("/categorias", data);
    return res.data;
}

// Actualizar una categoría existente
export async function updateCategoria(id, data) {
    const res = await api.patch(`/categorias/${id}`, data);
    return res.data;
}

// Eliminar una categoría
export async function deleteCategoria(id) {
    await api.delete(`/categorias/${id}`);
}