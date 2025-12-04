import { Link, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useTienda } from "../contexts/TiendaContext";
import Nav_Categories from "./Nav_Category";

import "../styles/Header.css";

import { MdOutlineAddShoppingCart } from "react-icons/md";
import { VscAccount } from "react-icons/vsc";
import { FaSearch } from "react-icons/fa";



/**
* Componente Header
* 
* Renderiza el encabezado principal de la aplicación con navegación.
* Detecta automáticamente si está en una tienda para usar el login correcto.
*/

function Header() {
    const { nombreTienda } = useParams();
    const location = useLocation();
    const { isAuthenticated, userType } = useAuth();
    const { tienda } = useTienda();
    
    // Si no hay nombreTienda en params, intentar extraerlo de la URL como fallback
    const tiendaSlug = nombreTienda || location.pathname.split("/")[2];
    const loginPath = tiendaSlug ? `/tienda/${tiendaSlug}/login` : "/login";
    
    // Obtener el nombre de la tienda (nombreFantasia) o usar un valor por defecto
    const nombreTiendaDisplay = tienda?.nombreFantasia || "TradioGlobal";

    return (
        <>
            {/* Contenedor principal del header */}
            <div className="header-all-contenedor">
                <header className="header">

                    {/* Logo de la aplicación con enlace a la página principal */}
                    <Link to={tiendaSlug ? `/tienda/${tiendaSlug}/home` : "/"} className="link-logo">
                        <div className="header-logo">
                            {tienda?.logo ? (
                                <div className="header-logo-container">
                                    <img 
                                        src={tienda.logo} 
                                        alt={nombreTiendaDisplay}
                                        className="header-logo-img"
                                    />
                                    <h1 className="header-logo-text">{nombreTiendaDisplay}</h1>
                                </div>
                            ) : (
                                <h1 className="header-logo-text">{nombreTiendaDisplay}</h1>
                            )}
                        </div>
                    </Link>

                    {/* Sección central: Barra de búsqueda de productos */}
                    <div className="header-search">
                        <div className="search-box">
                            <FaSearch className="lupa"/>
                            <input 
                                type="text" 
                                className="buscador" 
                                placeholder="Buscar productos..."
                                aria-label="Buscar productos"
                            />
                        </div>
                    </div>

                    {/* Sección derecha: Enlaces a cuenta y carrito */}
                    <div className="header-right">
                        {/* Enlace a la página de login/inicio de sesión */}
                        {!isAuthenticated ? (
                            <Link 
                                to={loginPath} 
                                className="link-login"
                                state={{ from: location.pathname }}
                            >
                                <div className="cuenta-box">
                                    <VscAccount className="logo-cuenta" size={24}/>
                                    <span>Iniciar Sesión</span>
                                </div>
                            </Link>
                        ) : (
                            <Link to={loginPath} className="link-login">
                                <div className="cuenta-box">
                                    <VscAccount className="logo-cuenta" size={26}/>
                                    <span>Mi Cuenta</span>
                                </div>
                            </Link>
                        )}

                        {/* Enlace al carrito de compras */}
                        <Link 
                            to={tiendaSlug ? `/tienda/${tiendaSlug}/carrito` : "/"} 
                            className="link-carrito"
                        >
                            <div className="cart-icon">
                                <MdOutlineAddShoppingCart size={25}/>
                            </div>
                        </Link>
                    </div>

                </header>
            </div>

            {/* Componente de navegación por categorías */}
            <Nav_Categories />

        </>
    );
};
export default Header