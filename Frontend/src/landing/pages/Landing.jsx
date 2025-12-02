import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../tienda/contexts/AuthContext.jsx";
import "../styles/Landing.css";

/**
 * Componente Landing
 * 
 * Página inicial de la aplicación. Muestra información general
 * y permite navegar a las tiendas o iniciar sesión.
 * Diseño basado en landing.html
 */
function Landing() {
    const { isAuthenticated, usuario, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/", { replace: true });
    };

    const scrollToFeatures = (e) => {
        e.preventDefault();
        const featuresSection = document.getElementById("features");
        if (featuresSection) {
            featuresSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="landing-page">
            {/* Header de navegación */}
            <header className="landing-header">
                <nav className="landing-nav">
                    <Link to="/" className="landing-logo">
                        <i className="fas fa-store"></i>
                        <h1>TradioGlobal</h1>
                    </Link>
                    <div className="landing-nav-actions">
                        <a href="#features" onClick={scrollToFeatures} className="landing-nav-link">
                            Características
                        </a>
                        <a href="#" className="landing-nav-link">Acerca de</a>
                        <a href="#" className="landing-nav-link">Soporte</a>
                        <Link to="/tiendas" className="btn-secondary">
                            <i className="fas fa-shopping-bag"></i>
                            Explorar Tiendas
                        </Link>
                        {isAuthenticated ? (
                            <>
                                <Link to="/login" className="btn-primary">
                                    <i className="fas fa-user"></i>
                                    Mi Cuenta
                                </Link>
                                <button onClick={handleLogout} className="btn-logout">
                                    <i className="fas fa-sign-out-alt"></i>
                                    Cerrar Sesión
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="btn-primary">
                                <i className="fas fa-sign-in-alt"></i>
                                Iniciar Sesión
                            </Link>
                        )}
                    </div>
                </nav>
            </header>

            {/* Sección Hero */}
            <main>
                <section className="hero-section">
                    <div className="hero-content">
                        <h1 className="hero-title">Plataforma Multitienda para Vendedores</h1>
                        <p className="hero-subtitle">
                            Crea tu propia tienda online y vende tus productos. 
                            Descubre productos increíbles de múltiples tiendas en un solo lugar.
                            Gestiona tu negocio de manera eficiente y profesional.
                        </p>
                        <div className="hero-actions">
                            <Link to="/tiendas" className="btn-primary">
                                <i className="fas fa-shopping-bag"></i>
                                Explorar Tiendas
                            </Link>
                            <Link to="/login" className="btn-secondary">
                                <i className={isAuthenticated ? "fas fa-user" : "fas fa-rocket"}></i>
                                {isAuthenticated ? "Mi Cuenta" : "Comenzar Gratis"}
                            </Link>
                        </div>
                        <div className="hero-image">
                            <div className="hero-dashboard-preview">
                                <div className="preview-header">
                                    <div className="preview-logo">
                                        <i className="fas fa-store"></i>
                                        <span>Mi Tienda</span>
                                    </div>
                                    <span>Dashboard</span>
                                </div>
                                <div className="preview-stats">
                                    <div className="preview-stat">
                                        <span className="preview-stat-number">10</span>
                                        <span className="preview-stat-label">Tiendas</span>
                                    </div>
                                    <div className="preview-stat">
                                        <span className="preview-stat-number">50</span>
                                        <span className="preview-stat-label">Usuarios</span>
                                    </div>
                                    <div className="preview-stat">
                                        <span className="preview-stat-number">120</span>
                                        <span className="preview-stat-label">Productos</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Sección de Características */}
                <section className="features-section" id="features">
                    <div className="features-container">
                        <h2 className="section-title">¿Por qué elegir nuestra plataforma?</h2>
                        <p className="section-subtitle">
                            Nuestra plataforma está diseñada para vendedores y compradores,
                            ofreciendo herramientas poderosas y fáciles de usar.
                        </p>
                        <div className="features-grid">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <i className="fas fa-store"></i>
                                </div>
                                <h3 className="feature-title">Tu Propia Tienda</h3>
                                <p className="feature-description">
                                    Crea y personaliza tu tienda online con tu logo, 
                                    nombre y descripción. Totalmente personalizable.
                                </p>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <i className="fas fa-box"></i>
                                </div>
                                <h3 className="feature-title">Gestión de Productos</h3>
                                <p className="feature-description">
                                    Administra tu catálogo de productos, categorías, 
                                    precios y stock de manera intuitiva.
                                </p>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <i className="fas fa-shopping-cart"></i>
                                </div>
                                <h3 className="feature-title">Gestión de Pedidos</h3>
                                <p className="feature-description">
                                    Recibe y gestiona pedidos en tiempo real. 
                                    Controla el estado de cada venta desde tu panel.
                                </p>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <i className="fas fa-chart-line"></i>
                                </div>
                                <h3 className="feature-title">Estadísticas y Reportes</h3>
                                <p className="feature-description">
                                    Visualiza tus ventas, productos más vendidos 
                                    y rendimiento de tu tienda con gráficos detallados.
                                </p>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <i className="fas fa-credit-card"></i>
                                </div>
                                <h3 className="feature-title">Pagos Integrados</h3>
                                <p className="feature-description">
                                    Integración con Mercado Pago para recibir pagos 
                                    de forma segura y rápida.
                                </p>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <i className="fas fa-shield-alt"></i>
                                </div>
                                <h3 className="feature-title">Seguridad</h3>
                                <p className="feature-description">
                                    Protección de datos con autenticación JWT 
                                    y encriptación avanzada.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Sección de Call to Action */}
                <section className="cta-section">
                    <div className="cta-container">
                        <h2 className="cta-title">¿Listo para comenzar a vender?</h2>
                        <p className="cta-description">
                            Únete a cientos de vendedores que ya confían en nuestra plataforma
                            para gestionar sus tiendas online de manera eficiente.
                        </p>
                        <div className="cta-actions">
                            <Link to="/tiendas" className="btn-primary-inverse">
                                <i className="fas fa-shopping-bag"></i>
                                Explorar Tiendas
                            </Link>
                            <Link to="/login" className="btn-secundary-inverse">
                                <i className={isAuthenticated ? "fas fa-user" : "fas fa-user-plus"}></i>
                                {isAuthenticated ? "Mi Cuenta" : "Crear Cuenta Gratis"}
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-section">
                        <h3>E-commerce Multitienda</h3>
                        <p>
                            La solución integral para crear y gestionar tu tienda online.
                            Diseñada para vendedores, para vendedores.
                        </p>
                    </div>
                    <div className="footer-section">
                        <h3>Producto</h3>
                        <p><a href="#features" onClick={scrollToFeatures}>Características</a></p>
                        <p><a href="#">Precios</a></p>
                    </div>
                    <div className="footer-section">
                        <h3>Soporte</h3>
                        <p><a href="#">Centro de Ayuda</a></p>
                        <p><a href="#">Contacto</a></p>
                    </div>
                    <div className="footer-section">
                        <h3>Legal</h3>
                        <p><a href="#">Política de Privacidad</a></p>
                        <p><a href="#">Términos de Servicio</a></p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2025 E-commerce Multitienda. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
}

export default Landing;

