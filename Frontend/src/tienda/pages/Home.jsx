import "../styles/Home.css";
import Header from "../components/Header.jsx";
import { useTienda } from "../contexts/TiendaContext";
import { getProductosByTienda } from "../services/productos";
import CarouselImg from "../components/CarouselImg.jsx";
import { useState, useEffect } from "react";
import "../styles/Productos.css";
import Footer_Landing from "../../landing/components/Footer_Landing.jsx";

/**
* Componente Home
* Renderiza la página principal del ecommerce.
* Muestra un grid de productos utilizando el componente ProductoHome
* con diferentes IDs para cada producto.
* * Esta página es pública - no requiere autenticación para ver la tienda.
*/
const homeImages = [
    "/img/slider1.jpg",
    "/img/slider2.jpg",
    "/img/slider3.jpg",
    "/img/slider4.jpg",
    "/img/slider5.jpg"
];

function Home() {
    const { tienda, loading, error } = useTienda();
    const [productos, setProductos] = useState([]);
    const [cargandoProductos, setCargandoProductos] = useState(true);
    const [errorProductos, setErrorProductos] = useState(null);

    // --- FIX BACKEND: Función para obtener la imagen principal ---
    const obtenerImagen = (prod) => {
        // 1. Si viene una lista (nueva logica Java: List<String>)
        if (prod.imagenes && Array.isArray(prod.imagenes) && prod.imagenes.length > 0) {
            return prod.imagenes[0];
        }
        // 2. Si viene un string (logica vieja: String)
        if (prod.imagen && typeof prod.imagen === 'string' && prod.imagen.trim() !== "") {
            return prod.imagen;
        }
        // 3. Fallback
        return "/default-product.png";
    };
    // -------------------------------------------------------------

    // Cargar productos de la tienda
    useEffect(() => {
        if (!tienda?.nombreUrl) {
            setCargandoProductos(false);
            return;
        }

        const cargarProductos = async () => {
            try {
                setCargandoProductos(true);
                setErrorProductos(null);
                // Debug: verificar qué se está cargando
                console.log("Cargando productos para tienda:", tienda.nombreUrl);
                const productosData = await getProductosByTienda(tienda.nombreUrl);
                console.log("Productos cargados:", productosData);
        
                // Mostrar solo los primeros 6 productos en la home
                setProductos(Array.isArray(productosData) ? productosData.slice(0, 6) : []);
            } catch (err) {
                console.error("Error cargando productos:", err);
                setErrorProductos(err.message || "Error al cargar productos");
       
            } finally {
                setCargandoProductos(false);
            }
        };

        cargarProductos();
    }, [tienda?.nombreUrl]);

    // Mostrar estado de carga mientras se obtiene la tienda
    if (loading) {
        return (
            <>
                <Header />
                <main className="main-home-contenedor">
                    <p>Cargando tienda...</p>
         
                </main>
            </>
        );
    }

    // Mostrar error si la tienda no se encuentra
    if (error) {
        return (
            <>
                <Header />
                <main className="main-home-contenedor">
                    <div style={{ textAlign: "center", padding: "40px" }}>
 
                        <h2>Tienda no encontrada</h2>
                        <p>{error}</p>
                    </div>
                </main>
            </>
   
        );
    }

    // Si no hay tienda cargada, mostrar mensaje
    if (!tienda) {
        return (
            <>
                <Header />
                <main className="main-home-contenedor">
                    <div style={{ 
                        textAlign: "center", padding: "40px" }}>
                        <h2>Tienda no encontrada</h2>
                        <p>La tienda que buscas no existe o no está disponible.</p>
                    </div>
                </main>
 
            </>
        );
    }

    // Determinar qué banners mostrar: los de la tienda o los por defecto
    const bannersAMostrar = (tienda.banners && Array.isArray(tienda.banners) && tienda.banners.length > 0) 
        ? tienda.banners 
        : homeImages;

    return (
        <>
            {/* Header de navegación de la aplicación */}
            <Header />
            
            {/*Carousel*/}
            <CarouselImg images={bannersAMostrar} />
            
     
            {/* Grid principal que contiene todos los productos */}
            <main className="main-home-contenedor">
                {cargandoProductos ? (
                    <p>Cargando productos...</p>
                ) : errorProductos ? (
        
                    <p style={{ color: "red" }}>Error: {errorProductos}</p>
                ) : productos.length === 0 ? (
                    <p>No hay productos disponibles en esta tienda.</p>
                ) : (
                    <div className="grid-home-prod">
 
                        {productos.map((prod) => (
                            <div key={prod.id} className="prod-home-container">
                                {/* Imagen del producto */}
         
                                <img 
                                    src={obtenerImagen(prod)} 
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
                                <p className="prod-home-descripcion">Descripción: {prod.descripcion ||
                                "Sin descripción"}</p>
                                {/* Botón para agregar el producto al carrito */}
                                <button className="prod-home-btn-carrito">Agregar al carrito</button>
                        
                            </div>
                        ))}
                    </div>
                )}
            </main>
            {/* Footer de la página */}
       
            <Footer_Landing />
        </>
    );
}

export default Home;