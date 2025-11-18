import Header from "../components/Header.jsx";
import "../styles/Carrito.css";

/**
* Componente Carrito
* 
* Muestra la página del carrito de compras del usuario.
* Renderiza una lista de productos agregados al carrito y un botón
* para realizar la compra.
*/

function Carrito() {
    return (
        <div>
            {/* Header de navegación de la aplicación */}
            <Header />

            {/* Sección de los items del carrito */}
            <div className="main-carrito">
                <div className="item-cart-cont">
                    <div className="items-cart">
                        <h1>Producto 1</h1>
                    </div>
                    <div className="items-cart">
                        <h1>Producto 2</h1>
                    </div>
                    <div className="items-cart">
                        <h1>Producto 3</h1>
                    </div>
                </div>  
            
                {/* Sección de confirmación y botón para realizar compra */}
                <div className="cart-confirm">
                    <h1>Realizar compra</h1>
                </div>
            </div>

        </div>
    );
};
export default Carrito