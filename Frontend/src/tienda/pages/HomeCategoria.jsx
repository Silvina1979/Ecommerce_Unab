import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header.jsx";
import { getProductosByTienda, getProductosByCategoria } from "../services/productos";
import { getCategoriasByTienda } from "../services/categorias";
import { useTienda } from "../contexts/TiendaContext";
import "../styles/Productos.css";

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
    const { tienda, loading: tiendaLoading } = useTienda();
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
                <div className="main-catalogo">
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
            <div className="main-catalogo">
                <h2 style={{ marginBottom: "20px" }}>
                    {categoriaActual ? `Categoría: ${categoriaActual.nombre}` : "Categoría no encontrada"}
                </h2>
                {productos.length === 0 ? (
                    <p>No hay productos disponibles en esta categoría.</p>
                ) : (
                    <div className="grid-home-prod">
                        {productos.map((prod) => (
                            <div key={prod.id} className="prod-home-container">
                                <img src={prod.imagen} alt={prod.nombre} className="prod-home-image" />
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
        </div>
    );
}

export default HomeCategoria;

