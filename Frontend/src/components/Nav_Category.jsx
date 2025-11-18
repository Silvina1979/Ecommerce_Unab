import { useEffect, useState } from "react";
import { getCategorias } from "../services/categorias";
import { Link } from "react-router-dom";

import "../styles/Nav_Category.css";

import "../styles/Header.css";

import { FaBars } from "react-icons/fa6";

/**
* Componente Nav_Categories
* 
* Renderiza la barra de navegación de categorías de productos.
* Obtiene las categorías desde la API al montar el componente
* y las muestra en una lista junto con categorías estáticas adicionales.
*/

function Nav_Categories() {
    // Estado para almacenar las categorías obtenidas de la API
    const [categorias, setCategorias] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        getCategorias()
            .then(data => {
                if (Array.isArray(data)) {
                    setCategorias(data);
                } else if (data && Array.isArray(data.content)) {
                    setCategorias(data.content);
                } else {
                    setCategorias([]);
                }
            })
            .catch(err => {
                console.error("Error cargando categorías:", err);
                setError("Error cargando categorías");
            });
    }, []);

        const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="main-nav"> 
                <div className="nav-cont-categ">

                    {/* Sección izquierda: Icono de menú hamburguesa */}
                    <div className="nav-menu" onMouseLeave={() => setIsMenuOpen(false)} onMouseEnter={toggleMenu}>
                        <div className="faBar-icon" >
                            <FaBars size={20}/>Categorías
                        </div>
                        
                        {/* Menú desplegable */}
                        {isMenuOpen && (
                            <div className="menu-desplegable">
                                <Link to="/catalogo" className="menu-item" onClick={() => setIsMenuOpen(false)}>Todas las categorías ⮞</Link>
                                {categorias.map((categoria) => (
                                    <div key={categoria.id} className="menu-item categoria">{categoria.nombre}</div>
                                ))}

                                {/* Categorias Temporales */}
                                <div className="menu-item categoria">Herramientas</div>
                                <div className="menu-item categoria">Belleza</div>
                                <div className="menu-item categoria">Tecnología</div>
                                <div className="menu-item categoria">Deportes</div>

                                {error && <p className="menu-error">{error}</p>}

                            </div>
                        )}
                    </div>

                    {/* Renderiza las categorías obtenidas de la API */}
                    {categorias.map((cat) => (
                        <li key={cat.id}>{cat.nombre}</li>
                    ))}
                    {/* Categorías estáticas temporales */}
                </div>
        </div>
    );
}
export default Nav_Categories;