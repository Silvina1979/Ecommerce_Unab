import axios from "axios";

/**
* Configuración base de la instancia de Axios para la API
* 
* Crea una instancia de Axios con la URL base del backend.
* Todas las peticiones HTTP a la API utilizarán esta configuración.
* 
* Base URL: 
* - http://localhost:8080/ecommerce (desarrollo local)
* - https://ecommerce-back-m9zg.onrender.com/ecommerce (producción)
*/

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

export default api;
