import { Link, useLocation } from "react-router-dom";
import "../../styles/footer_landing.css";

import { LuExternalLink } from "react-icons/lu";
/**
 * Componente Landing
 * 
 * Página inicial de la aplicación. Muestra información general
 * y permite navegar a las tiendas o iniciar sesión.
 * Diseño basado en landing
 */

function Footer_Landing() {
    const location = useLocation();
    const isLandingPage = location.pathname === "/";
    
    const scrollToFeatures = (e) => {
        e.preventDefault();
        const featuresSection = document.getElementById("features");
        if (featuresSection) {
            featuresSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <>
        {/* Footer */}
            <div className="footer">
                <div className="footer-container">
                    <div className="footer-section">
                        <h3>E-commerce Multitienda</h3>
                        <p>
                            La solución integral para crear y gestionar tu tienda online.
                            Diseñada para vendedores y para compradores.
                        </p>
                        {!isLandingPage && (
                            <Link to="/" className="link-to-landing">
                                <LuExternalLink /> Volver a la página principal
                            </Link>
                        )}
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
                    <p>&copy; 2025 TradioGlobal | E-commerce Multitienda. Todos los derechos reservados.</p>
                </div>
            </div>
        </>
    );
}

export default Footer_Landing;