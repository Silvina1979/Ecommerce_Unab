import { useState, useEffect } from "react";
import { Link, useNavigate} from "react-router-dom";
import { useAuth } from "../../tienda/contexts/AuthContext.jsx";
import { getAllTiendas } from "../../tienda/services/tiendas";
import { FaStore, FaUser, FaSignOutAlt, FaSignInAlt, FaShoppingBag } from "react-icons/fa";
import Footer_Landing from "../components/Footer_Landing";
import "../styles/ExplorarTiendas.css";
import "../../MainStyles.css";

function ExplorarTiendas() {
    const [tiendas, setTiendas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated, usuario, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/", { replace: true });
    };

    useEffect(() => {
        cargarTiendas();
    }, []);

    const cargarTiendas = async () => {
        try {
            const data = await getAllTiendas();
            setTiendas(data);
        } catch (err) {
            console.error("Error cargando tiendas:", err);
            setError("Hubo un problema al cargar las tiendas. Intenta nuevamente más tarde.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="explorar-page">
            {/* Header de navegación */}
            <header className="landing-header">
                <nav className="landing-nav">
                    <Link to="/" className="landing-logo">
                        <FaStore />
                        <h1>TradioGlobal</h1>
                    </Link>
                    <div className="landing-nav-container">
                        <div className="landing-nav-links-container">
                            <a href="#" className="landing-nav-link">Acerca de</a>
                            <a href="#" className="landing-nav-link">Soporte</a>
                        </div>
                        <div className="landing-nav-actions">
                            {isAuthenticated ? (
                                <>
                                    <Link to="/login" className="btn-primary">
                                        <FaUser />
                                        Mi Cuenta
                                    </Link>
                                    <button onClick={handleLogout} className="btn-logout">
                                        <FaSignOutAlt />
                                        Cerrar Sesión
                                    </button>
                                </>
                            ) : (
                                <Link to="/login" className="btn-primary">
                                    <FaSignInAlt />
                                    Iniciar Sesión
                                </Link>
                            )}
                        </div>
                    </div>
                </nav>
            </header>

            <main className="explorar-main">
                <div className="explorar-hero">
                    <h1 className="explorar-title">Nuestras Tiendas</h1>
                    <p className="explorar-subtitle">Descubre vendedores únicos y sus productos increíbles</p>
                </div>

                {loading ? (
                    <div className="explorar-loading">
                        <div className="spinner"></div>
                        <p>Cargando tiendas...</p>
                    </div>
                ) : error ? (
                    <div className="explorar-error">{error}</div>
                ) : tiendas.length === 0 ? (
                    <div className="explorar-empty">
                        <p>Aún no hay tiendas registradas.</p>
                        <Link to="/login" className="btn-crear">¡Sé el primero en crear una!</Link>
                    </div>
                ) : (
                    <div className="tiendas-grid">
                        {tiendas.map((tienda) => (
                            <Link 
                                to={`/tienda/${tienda.nombreUrl}/home`} 
                                key={tienda.id} 
                                className="tienda-card"
                            >
                                <div className="tienda-card-banner">
                                    {/* Si tiene banners, usa el primero. Si no, usa un placeholder */}
                                    {tienda.banners && tienda.banners.length > 0 ? (
                                        <img src={tienda.banners[0]} alt="Banner tienda" />
                                    ) : (
                                        <div className="banner-placeholder"></div>
                                    )}
                                </div>
                                
                                <div className="tienda-card-content">
                                    <div className="tienda-logo-wrapper">
                                        <img 
                                            src={tienda.logo || "/default-product.png"} 
                                            alt={tienda.nombreFantasia} 
                                            className="tienda-logo"
                                            onError={(e) => e.target.src = "/default-product.png"}
                                        />
                                    </div>
                                    <h2 className="tienda-nombre">{tienda.nombreFantasia}</h2>
                                    <p className="tienda-stock" style={{ fontSize: '0.85rem', color: '#27ae60', fontWeight: 'bold', marginBottom: '5px' }}>
                                        📦 {tienda.cantidadProductos || 0} Productos
                                    </p>
                                    <p className="tienda-desc">
                                        {tienda.descripcion 
                                            ? (tienda.descripcion.length > 80 ? tienda.descripcion.substring(0, 80) + "..." : tienda.descripcion)
                                            : "Visita esta tienda para ver sus productos."}
                                    </p>
                                    <div className="card-footer">
                                        <span className="btn-visitar">Visitar Tienda</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            <Footer_Landing />
        </div>
    );
}

export default ExplorarTiendas;