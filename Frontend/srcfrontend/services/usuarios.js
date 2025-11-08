import api from "./api";

/**
* Servicios para interactuar con el endpoint de usuarios de la API
*/

// Obtener todos los usuarios
export async function getUsuarios() {
    const res = await api.get("/usuarios");
    return res.data;
}

// Obtener un usuario por DNI
export async function getUsuarioByDni(dni) {
    const res = await api.get(`/usuarios/${dni}`);
    return res.data;
}

// Crear un nuevo usuario
export async function createUsuario(data) {
    const res = await api.post("/usuarios", data);
    return res.data;
}

// Actualizar un usuario (parcial)
export async function updateUsuario(dni, data) {
    const res = await api.patch(`/usuarios/${dni}`, data);
    return res.data;
}

// Eliminar un usuario
export async function deleteUsuario(dni) {
    await api.delete(`/usuarios/${dni}`);
}