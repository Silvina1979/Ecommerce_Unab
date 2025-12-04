import { useEffect, useState } from "react";
import { getCategoriasByTienda } from "../services/categorias";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import "../styles/Nav_Category.css";
import "../styles/Header.css";

import { FaBars } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa";

/**
 * Convierte un nombre de categoría a un slug para la URL
 * Reemplaza espacios con guiones y normaliza el texto
 */
function categoriaToSlug(nombre) {
    return nombre
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
        .replace(/[^a-z0-9]+/g, "-") // Reemplazar espacios y caracteres especiales con guiones
        .replace(/^-+|-+$/g, ""); // Eliminar guiones al inicio y final
}

/**
* Componente Nav_Categories
* 
* Renderiza la barra de navegación de categorías de productos.
* Obtiene las categorías desde la API al montar el componente
* y las muestra en una lista junto con categorías estáticas adicionales.
*/

function Nav_Categories() {
    const { nombreTienda } = useParams();
    // Estado para almacenar las categorías obtenidas de la API
    const [categorias, setCategorias] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!nombreTienda) {
            setError("Nombre de tienda no disponible");
            return;
        }

        getCategoriasByTienda(nombreTienda)
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
    }, [nombreTienda]);

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
                                <Link to={`/tienda/${nombreTienda}/catalogo`} className="menu-item" onClick={() => setIsMenuOpen(false)}>Todas las categorías <FaChevronRight /></Link>
                                {categorias.map((categoria) => (
                                    <Link 
                                        key={categoria.id} 
                                        to={`/tienda/${nombreTienda}/categoria/${categoriaToSlug(categoria.nombre)}`}
                                        className="menu-item categoria"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {categoria.nombre}
                                    </Link>
                                ))}

                                {error && <p className="menu-error">{error}</p>}

                            </div>
                        )}
                    </div>

                    {/* Renderiza las categorías obtenidas de la API */}
                    {categorias.map((cat) => (
                        <Link 
                            key={cat.id} 
                            to={`/tienda/${nombreTienda}/categoria/${categoriaToSlug(cat.nombre)}`}
                        >
                            <li className="categoria-item">{cat.nombre}</li>
                        </Link>
                    ))} 
                    {/* Categorías estáticas temporales */}
                </div>
        </div>
    );
}
export default Nav_Categories;