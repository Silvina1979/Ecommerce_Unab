import "../styles/Home.css";
import Header from "../components/Header.jsx";
import ProductoHome from "../components/Product_Home.jsx";
import CarouselImg from "../components/CarouselImg.jsx";

/**
* Componente Home
* Renderiza la página principal del ecommerce.
* Muestra un grid de productos utilizando el componente ProductoHome
* con diferentes IDs para cada producto.
*/

// Imágenes del carrusel
const homeImages = [
    "/img/slider1.jpg",
    "/img/slider2.jpg",
    "/img/slider3.jpg",
    "/img/slider4.jpg",
    "/img/slider5.jpg"
];

function Home() {
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
