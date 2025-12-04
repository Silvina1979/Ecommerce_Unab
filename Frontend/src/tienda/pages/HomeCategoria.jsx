import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header.jsx";
import { getProductosByTienda, getProductosByCategoria } from "../services/productos";
import { getCategoriasByTienda } from "../services/categorias";
import { useTienda } from "../contexts/TiendaContext";
import "../styles/Productos.css";
import Footer_Landing from "../../landing/components/Footer_Landing.jsx";

/**
 * Convierte un nombre de categoría a un slug para la URL
 * Reemplaza espacios con guiones y normaliza el texto
 */

function categoriaToSlug(nombre) {
    return nombre
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
        .replace(/[^a-z0-9]+/g, "-") // Reemplazar espacios y caracteres especiales con guiones
        .replace(/^-+|-+$/g, ""); // Eliminar guiones al inicio y final
}

/**
 * Componente HomeCategoria
 * 
 * Muestra productos filtrados por categoría
 */
function HomeCategoria() {
    const { nombreTienda, categoriaNombre } = useParams();
    const {tienda, loading: tiendaLoading } = useTienda();
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [categoriaActual, setCategoriaActual] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarDatos = async () => {
            if (!nombreTienda) {
                setError("Nombre de tienda no disponible");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                
                // Cargar categorías
                const categoriasData = await getCategoriasByTienda(nombreTienda);
                setCategorias(categoriasData);

                // Buscar la categoría comparando el slug de la URL con el slug del nombre de la categoría
                const categoriaSlug = categoriaNombre || "";
                const categoria = categoriasData.find(
                    cat => categoriaToSlug(cat.nombre) === categoriaSlug
                );

                if (categoria) {
                    setCategoriaActual(categoria);
                    // Cargar productos de esa categoría
                    const productosData = await getProductosByCategoria(nombreTienda, categoria.id);
                    setProductos(Array.isArray(productosData) ? productosData : []);
                } else {
                    setError("Categoría no encontrada");
                    setProductos([]);
                }
            } catch (err) {
                console.error(err);
                setError(`Error cargando productos: ${err.response?.status} ${err.response?.statusText || err.message}`);
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, [nombreTienda, categoriaNombre]);

    if (tiendaLoading || loading) {
        return (
            <>
                <Header />
                <div className="main-catalogo" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <p>Cargando productos...</p>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <div className="main-catalogo">
                    <p style={{ color: "red" }}>{error}</p>
                </div>
            </>
        );
    }

    return (
        <div>
            <Header />
            <div className="main-catalogo" style={{ maxWidth: "1270px", margin: "0 auto", display: "flex", flexFlow: "column", alignItems: "center" }}>
                <h2 style={{ maxWidth: "1200px", width: "100%" }}>
                    {categoriaActual ? `Categoría: ${categoriaActual.nombre}` : "Categoría no encontrada"}
                </h2>
                {productos.length === 0 ? (
                    <p>No hay productos disponibles en esta categoría.</p>
                ) : (
                    <div className="grid-home-prod">
                        {productos.map((prod) => (
                            <div key={prod.id} className="prod-home-container">
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
                                <h2 className="prod-home-nombre">{prod.nombre}</h2>
                                <p className="prod-home-precio">Precio: ${prod.precio}</p>
                                <p className="prod-home-stock">Stock: {prod.stock}</p>
                                <p className="prod-home-descripcion">Descripción: {prod.descripcion}</p>
                                <button className="prod-home-btn-carrito">Agregar al carrito</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {/* Footer de la página */}
            <Footer_Landing />
        </div>
    );
}

export default HomeCategoria;

