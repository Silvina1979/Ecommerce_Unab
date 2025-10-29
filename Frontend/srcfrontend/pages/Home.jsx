import "../styles/Home.css";
import Header from "../components/Header.jsx";
import ProductosEjemplo from "../components/ProductosEjemplo";

function Home() {
    return (
        <>
            <Header />

            <main className="main-content">
                <ProductosEjemplo />
            </main>
        </>
    );
}

export default Home;
