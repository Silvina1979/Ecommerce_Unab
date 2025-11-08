import "../styles/Login.css";
import Header from "../components/Header";
import BuscarUsuario from "../components/UsuarioID";

/**
* Componente Checkout

* Renderiza la página de checkout (finalización de compra).

*/

function Checkout() {
    return (
        <div>
            {/* Header de navegación de la aplicación */}
            <Header />
            {/* Contenedor principal del checkout */}
            <div className="main-checkout">
                <div>
                    <h2>CHECKOUT EN CONSTRUCCIÓN...</h2>
                </div>

                {/* <h3>Buscar Usuarios:</h3>
                <ul>
                    <li>Ejemplo DNI: 543623413</li>
                    <li>Ejemplo DNI: 123412234</li>
                    <li>Ejemplo DNI: 222333444</li>
                </ul> */}
                {/* Componente para buscar usuarios por DNI */}
                {/* <BuscarUsuario /> */}
            </div>
        </div>

    );
};
export default Checkout