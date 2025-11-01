import { MdOutlineAddShoppingCart } from "react-icons/md";
import { FaBars } from "react-icons/fa6";
import { VscAccount } from "react-icons/vsc";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../styles/Header.css";
import { useSearch } from "../context/SearchContext";





function Header() {
    const { updateSearchTerm } = useSearch();

    const handleSearchChange = (e) => {
        updateSearchTerm(e.target.value);
    };

    return (
        <div className="header-all-contenedor">
            <header className="header">
                <div className="header-left">
                    <div className="faBar-icon">
                        <FaBars size={25}/>
                    </div>
                </div>

                <Link to="/" className="link-logo"> {/* Creamos el link para la pagina principal */}
                    <div className="header-logo">
                        <h1>MITINEDA</h1>
                    </div>
                </Link>

                <div className="header-search">
                    <div className="search-box">
                        <FaSearch className="lupa"/>
                        <input 
                            type="text" 
                            className="buscador" 
                            placeholder="Buscar productos..."
                            onChange={handleSearchChange}
                            />
                    </div>
                </div>

                <div className="header-right">
                    <Link to="/login" className="link-login"> {/* Creamos el link para el login */}
                        <div className="cuenta-box">
                            <VscAccount className="logo-cuenta" size={25}/>
                            <span>Mi Cuenta</span>
                        </div>
                    </Link>

                    <Link to="/carrito" className="link-carrito"> {/* Creamos el link para el carrito */}
                        <div className="cart-icon">
                            <MdOutlineAddShoppingCart size={25}/>
                        </div>
                    </Link>
                </div>

            </header>
        </div>
    );
};
export default Header