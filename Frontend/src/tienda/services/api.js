import axios from "axios";

/**
 * Configuración base de Axios para la API
* 
 * Incluye interceptores para:
 * - Agregar automáticamente el token JWT en el header Authorization
 * - Manejar errores 401/403 (token inválido o expirado)
 */

// En desarrollo, si no hay VITE_API_URL definida, usa el proxy de Vite (/api)
// En producción o si VITE_API_URL está definida, usa esa URL
// 
// URLs disponibles según documentación:
// - Google Cloud (Producción): https://ecommerce-back-1018928649112.us-central1.run.app/
// - Render (Alternativa): https://ecommerce-back-2uxy.onrender.com
//
// IMPORTANTE: El baseURL debe terminar con /api/ para que las rutas en los servicios
// funcionen correctamente tanto en desarrollo (proxy) como en producción

// Función para normalizar la URL y asegurar que termine en /api/
function normalizeBaseURL(url) {
    if (!url) return null;
    if (url.endsWith('/api/')) return url;
    if (url.endsWith('/api')) return url + '/';
    if (url.endsWith('/')) return url + 'api/';
    return url + '/api/';
}

// URL de producción por defecto
const PROD_API_URL = 'https://ecommerce-back-1018928649112.us-central1.run.app/';

let baseURL;
if (import.meta.env.VITE_API_URL) {
    // Si hay VITE_API_URL definida, usarla (tiene prioridad)
    baseURL = normalizeBaseURL(import.meta.env.VITE_API_URL);
} else if (import.meta.env.DEV) {
    // En desarrollo, por defecto usar la URL de producción
    // El proxy solo se usa si VITE_USE_PROXY=true está configurado
    // Esto permite trabajar sin necesidad de tener el backend corriendo localmente
    const useProxy = import.meta.env.VITE_USE_PROXY === 'true';
    
    if (useProxy) {
        // Solo usar proxy si está explícitamente configurado
        // Requiere que el backend esté corriendo en localhost:8080
        baseURL = '/api/';
        if (typeof window !== 'undefined') {
            console.log('[API] Usando proxy local (requiere backend en localhost:8080)');
        }
    } else {
        // Por defecto, usar la URL de producción
        // No requiere backend local corriendo
        baseURL = normalizeBaseURL(PROD_API_URL);
        if (typeof window !== 'undefined') {
            console.log('[API] Usando URL de producción:', baseURL);
        }
    }
} else {
    // En producción, usar la URL de producción
    baseURL = normalizeBaseURL(PROD_API_URL);
}

const api = axios.create({
    baseURL: baseURL,
    timeout: 30000, // 30 segundos de timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor: Agrega token JWT automáticamente
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Asegurar que Content-Type sea application/json si no está definido y no es FormData
    // Para métodos POST, PUT, PATCH que envían datos
    // NO establecer Content-Type para FormData - Axios lo maneja automáticamente con el boundary
    if (!(config.data instanceof FormData)) {
        if (['post', 'put', 'patch'].includes(config.method?.toLowerCase())) {
            // Solo establecer Content-Type si no está ya definido explícitamente
            if (!config.headers['Content-Type']) {
                config.headers['Content-Type'] = 'application/json';
            }
        }
    } else {
        // Para FormData, eliminar Content-Type para que Axios lo establezca automáticamente con boundary
        delete config.headers['Content-Type'];
    }
    
    return config;
});

/**
 * Interceptor de response: Maneja errores de autenticación
 * Si recibe 401 o 403, elimina el token y redirige al login
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Log básico de errores (solo en desarrollo)
        if (import.meta.env.DEV && error.response) {
            console.error(`[API Error] ${error.response.status} ${error.config?.url}:`, 
                error.response?.data?.message || error.message);
        }

        // Manejar timeout
        if (error.code === 'ECONNABORTED' || error.message === 'timeout of 30000ms exceeded') {
            error.message = 'La petición tardó demasiado. Verifica tu conexión a internet.';
        }

        // Manejar errores de red
        if (error.code === 'ERR_NETWORK' || !error.response) {
            error.message = 'Error de conexión. Verifica que el servidor esté disponible.';
        }

        if (error.response?.status === 401 || error.response?.status === 403) {
            // Eliminar el token del localStorage
            localStorage.removeItem("auth_token");
            localStorage.removeItem("auth_user");
            
            // Redirigir al login solo si:
            // 1. No estamos ya en la página de login
            // 2. No estamos en una ruta pública de tienda (las tiendas son públicas para ver)
            // 3. No estamos en la landing page
            const currentPath = window.location.pathname;
            const isPublicRoute = currentPath === "/login" || 
                                  currentPath === "/" ||
                                  currentPath.startsWith("/tienda/");
            
            if (!isPublicRoute) {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
