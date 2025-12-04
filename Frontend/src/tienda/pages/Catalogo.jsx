import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header.jsx";
import { getProductosByTienda } from "../services/productos.js";
import "../styles/Productos.css";

/**
* Componente Catalogo
* 
* Renderiza la página del catálogo de todos los productos
* Mustras su Imagen, nombre, stock, precio y descripcion.
*/

function Catalogo() {
    const { nombreTienda } = useParams();
    // Estado para almacenar los productos obtenidos de la API
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!nombreTienda) {
            setError("Nombre de tienda no disponible");
            setLoading(false);
            return;
        }

        setLoading(true);
        getProductosByTienda(nombreTienda)
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
    }, [nombreTienda]);

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
                            <img 
                                src={prod.imagen && prod.imagen.trim() !== "" ? prod.imagen : "/default-product.png"} 
                                alt={prod.nombre} 
                                className="prod-home-image"
                                onError={(e) => {
                                    // Si la imagen falla al cargar, evitar bucle infinito
                                    if (!e.target.dataset.fallback) {
                                        e.target.dataset.fallback = "true";
                                        // Usar una imagen placeholder SVG
                                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23ddd' width='200' height='200'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='14' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3ESin imagen%3C/text%3E%3C/svg%3E";
                                    }
                                }}
                            />
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
