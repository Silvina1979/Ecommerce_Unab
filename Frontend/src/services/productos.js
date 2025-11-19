import api from "./api";

/**
* Servicios para interactuar con el endpoint de productos de la API
*/

// Obtener todos los productos
export async function getProductos() {
    const res = await api.get("/productos");
    return res.data;
}

// Obtener un producto específico por ID
export async function getProductoById(id) {
    const res = await api.get(`/productos/${id}`);
    return res.data;
}

// Crear un nuevo producto
export async function createProducto(data) {
    const res = await api.post("/productos", data);
    return res.data;
}

// Actualizar un producto (parcial)
export async function updateProducto(id, data) {
    const res = await api.patch(`/productos/${id}`, data);
    return res.data;
}

// Eliminar un producto
export async function deleteProducto(id) {
    await api.delete(`/productos/${id}`);
}
