import { useEffect } from "react"; // <--- Importamos useEffect
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../tienda/contexts/AuthContext";
import Footer_Landing from "../components/Footer_Landing";
import { FaStore, FaUser, FaSignOutAlt, FaSignInAlt, FaArrowLeft } from "react-icons/fa";
import "../styles/InfoPages.css"; 
import "../../MainStyles.css";
import "../styles/Landing.css"; 

// Diccionario de contenido de relleno (Mock)
const contenidoMock = {
    "caracteristicas": {
        titulo: "Características del Producto",
        texto: "Nuestra plataforma multitienda ofrece gestión de inventario en tiempo real, pasarela de pagos integrada con Mercado Pago, y un panel administrativo intuitivo tanto para vendedores como para compradores. Diseñado para escalar tu negocio digital."
    },
    "precios": {
        titulo: "Planes y Precios",
        texto: "Actualmente ofrecemos un plan gratuito para comenzar. Próximamente lanzaremos planes Premium con menores comisiones por venta y herramientas avanzadas de marketing y analítica."
    },
    "ayuda": {
        titulo: "Centro de Ayuda",
        texto: "Si tienes problemas con tu cuenta, pagos o gestión de productos, por favor contáctanos. Nuestro equipo de soporte está disponible de Lunes a Viernes de 9hs a 18hs."
    },
    "contacto": {
        titulo: "Contacto",
        texto: "Puedes escribirnos a soporte@tradioglobal.com o visitarnos en nuestras oficinas centrales. Estamos aquí para escuchar tus sugerencias y resolver tus dudas."
    },
    "privacidad": {
        titulo: "Política de Privacidad",
        texto: "En TradioGlobal nos tomamos muy en serio la seguridad de tus datos. Utilizamos encriptación de extremo a extremo y no compartimos tu información personal con terceros sin tu consentimiento explícito. Cumplimos con todas las normativas de protección de datos vigentes."
    },
    "terminos": {
        titulo: "Términos de Servicio",
        texto: "Al utilizar nuestra plataforma, aceptas operar de buena fe. Está prohibida la venta de artículos ilegales. TradioGlobal actúa como intermediario y no se responsabiliza por la calidad final de los productos ofrecidos por terceros, aunque ofrecemos mecanismos de reembolso."
    }
};

function InfoPages() {
    const { pagina } = useParams();
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    // Efecto para hacer scroll arriba cada vez que cambia la página
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pagina]); // Se ejecuta cuando cambia el parámetro 'pagina'

    const handleLogout = () => {
        logout();
        navigate("/", { replace: true });
    };
    
    // Si la página no existe en el diccionario, mostramos un default
    const info = contenidoMock[pagina] || {
        titulo: "Página no encontrada",
        texto: "Lo sentimos, la sección que buscas no está disponible."
    };

    return (
        // Usamos la clase 'landing-page' para heredar estilos base si los hubiera
        <div className="landing-page info-page-wrapper">
            
            {/* --- HEADER ESTILO LANDING (Copiado y adaptado de Landing.jsx) --- */}
            <header className="landing-header">
                <nav className="landing-nav">
                    <Link to="/" className="landing-logo">
                        <FaStore />
                        <h1>TradioGlobal</h1>
                    </Link>
                    <div className="landing-nav-container">
                        {/* Links de navegación simples para volver a secciones de la landing */}
                        <div className="landing-nav-links-container">
                            <Link to="/" className="landing-nav-link">Inicio</Link>
                            <Link to="/tiendas" className="landing-nav-link">Tiendas</Link>
                        </div>
                        <div className="landing-nav-actions">
                            {isAuthenticated ? (
                                <>
                                    <Link to="/perfil/compras" className="btn-primary-header">
                                        <FaUser /> Mi Cuenta
                                    </Link>
                                    <button onClick={handleLogout} className="btn-logout">
                                        <FaSignOutAlt /> Cerrar Sesión
                                    </button>
                                </>
                            ) : (
                                <Link to="/login" className="btn-primary-header">
                                    <FaSignInAlt /> Iniciar Sesión
                                </Link>
                            )}
                        </div>
                    </div>
                </nav>
            </header>

            {/* --- CONTENIDO PRINCIPAL --- */}
            <main className="info-main-section">
                <div className="info-container">
                    <Link to="/" className="info-back-link">
                        <FaArrowLeft /> Volver al inicio
                    </Link>

                    <div className="info-card">
                        <h1 className="info-title">{info.titulo}</h1>
                        <div className="info-divider"></div>
                        
                        <div className="info-content-body">
                            <p className="info-highlight">
                                {info.texto}
                            </p>
                            
                            {/* Texto de relleno (Lorem Ipsum) para dar cuerpo a la página legal */}
                            <h3>Detalles Adicionales</h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </p>
                            <p>
                                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                            <ul>
                                <li>Transparencia en todas nuestras operaciones.</li>
                                <li>Seguridad de datos garantizada.</li>
                                <li>Soporte continuo para nuestros usuarios.</li>
                            </ul>
                            <p>
                                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer_Landing />
        </div>
    );
}

export default InfoPages;