import React, { useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import { getProductos } from "../services/productos.js";
import "../styles/Productos.css";

/**
* Componente Catalogo
* 
* Renderiza la página del catálogo de todos los productos
* Mustras su Imagen, nombre, stock, precio y descripcion.
*/

function Catalogo() {
    // Estado para almacenar los productos obtenidos de la API
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        getProductos()
            .then((data) => {
                // Si la API envía un objeto con propiedad 'content' u otra,
                // intentar normalizar y tomar el arreglo de productos.
                if (Array.isArray(data)) {
                    setProductos(data);
                } else if (data && Array.isArray(data.content)) {
                    setProductos(data.content);
                } else {
                    // intentar detectar una lista dentro del objeto
                    setProductos(data || []);
                }
            })
            .catch((err) => {
                console.error(err);
                setError(`Error cargando productos: ${err.response?.status} ${err.response?.statusText || err.message}`);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            {/* Header de navegación de la aplicación */}
            <Header />

            {/* Contenedor principal del catálogo */}
            <div className="main-catalogo">
                <div className="grid-home-prod">
                    {loading && <p>Cargando productos...</p>}
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    {!loading && !error && productos.length === 0 && (
                        <p>No hay productos disponibles.</p>
                    )}

                    {/* Renderiza los productos obtenidos de la API */}
                    {productos.map((prod) => (
                        <div key={prod.id} className="prod-home-container">
                            {/* Imagen del producto */}
                            <img src={prod.imagen} alt={prod.nombre} className="prod-home-image" />
                            {/* Nombre del producto */}
                            <h2 className="prod-home-nombre">{prod.nombre}</h2>
                            {/* Precio del producto */}
                            <p className="prod-home-precio">Precio: ${prod.precio}</p>
                            {/* Stock disponible del producto */}
                            <p className="prod-home-stock">Stock: {prod.stock}</p>
                            {/* Descripción del producto */}
                            <p className="prod-home-descripcion">Descripción: {prod.descripcion}</p>
                            {/* Botón para agregar el producto al carrito */}
                            <button className="prod-home-btn-carrito">Agregar al carrito</button>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

export default Catalogo;
