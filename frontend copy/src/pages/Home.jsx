import React, {useState, useEffect} from 'react';
import "../styles/Home.css";
import Header from "../components/Header.jsx";
import ProductosEjemplo from "../components/ProductosEjemplo";

function Home() {
    // 1. Creamos un estado para guardar los productos REALES que vienen de la API
    const [productos, setProductos] = useState([]);
    // (Opcional) Un estado para mostrar un mensaje de "Cargando..."
    const [loading, setLoading] = useState(true);

    // 2. useEffect se ejecuta solo una vez (cuando el componente carga)
    //    para llamar a la API.
    useEffect(() => {
        // ¡La URL correcta de tu backend!
        const apiUrl = 'http://localhost:8080/ecommerce/api/productos';

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                setProductos(data); // Guardamos los productos reales en el estado
                setLoading(false);  // Dejamos de cargar
            })
            .catch(error => {
                console.error('Error al traer los productos:', error);
                setLoading(false); // Dejamos de cargar si hay un error
            });
    }, []); // El [] vacío asegura que esto se ejecute solo una vez

    return (

        <>
            <Header />

            <main className="main-content">
                {/* 3. Mostramos un mensaje mientras los datos cargan */}
                {loading ? (
                    <p>Cargando productos...</p>
                ) : (
                    // 4. Una vez cargados, le pasamos los productos REALES
                    //    al componente <ProductosEjemplo /> como un "prop"
                    <ProductosEjemplo productos={productos} />
                )}
            </main>
        </>
    );
}

export default Home;