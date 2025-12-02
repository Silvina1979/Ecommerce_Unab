import "../styles/Home.css";
import Header from "../components/Header.jsx";
import ProductoHome from "../components/Product_Home.jsx";
import { useAuth } from "../contexts/AuthContext";
import { useTienda } from "../contexts/TiendaContext";
import CarouselImg from "../components/CarouselImg.jsx";


/**
* Componente Home
* Renderiza la página principal del ecommerce.
* Muestra un grid de productos utilizando el componente ProductoHome
* con diferentes IDs para cada producto.
* 
* Esta página es pública - no requiere autenticación para ver la tienda.
*/
const homeImages = [
    "/img/slider1.jpg",
    "/img/slider2.jpg",
    "/img/slider3.jpg",
    "/img/slider4.jpg",
    "/img/slider5.jpg"
];

function Home() {
    const auth = useAuth();
    const { tienda, loading, error } = useTienda();

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
                    <div style={{ textAlign: "center", padding: "40px" }}>
                        <h2>Tienda no encontrada</h2>
                        <p>La tienda que buscas no existe o no está disponible.</p>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            {/* Header de navegación de la aplicación */}
            <Header />
            
            {/*Carousel*/}
            <CarouselImg images={homeImages} />
            
            {/* Grid principal que contiene todos los productos */}
            <main className="main-home-contenedor">
                <ProductoHome id={1} />
                <ProductoHome id={2} />
                <ProductoHome id={3} />
            </main>
        </>
    );
}

export default Home;
