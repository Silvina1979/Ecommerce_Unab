import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../tienda/contexts/AuthContext";
import "../styles/AdminLayout.css";

/**
 * Layout del panel administrativo
 * 
 * Proporciona la estructura base con sidebar y navbar
 * para todas las páginas del panel de administración
 */
function AdminLayout() {
    const { usuario, logout, tiendaUsuario } = useAuth();
    const { nombreTienda } = useParams();
    const navigate = useNavigate();

    // Obtener el nombreTienda de los params o de la tienda del usuario
    const tiendaActual = nombreTienda || tiendaUsuario?.nombreUrl || tiendaUsuario?.nombreTienda || 'tienda';

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <h2 className="admin-sidebar-title">
                        Panel Admin
                    </h2>
                </div>

                <nav className="admin-sidebar-nav">
                    <Link 
                        to={`/admin/${tiendaActual}/dashboard`}
                        className="admin-sidebar-link"
                    >
                        📊 Dashboard
                    </Link>
                    <Link 
                        to={`/admin/${tiendaActual}/configuracion`}
                        className="admin-sidebar-link"
                    >
                        🏪 Mi Tienda
                    </Link>
                    <Link 
                        to={`/admin/${tiendaActual}/productos`}
                        className="admin-sidebar-link"
                    >
                        📦 Productos
                    </Link>
                    <Link 
                        to={`/admin/${tiendaActual}/pedidos`}
                        className="admin-sidebar-link"
                    >
                        🛒 Pedidos
                    </Link>
                    <Link 
                        to={`/admin/${tiendaActual}/categorias`}
                        className="admin-sidebar-link"
                    >
                        📁 Categorías
                    </Link>
                </nav>

                <div className="admin-sidebar-footer">
                    {usuario && (
                        <div className="admin-sidebar-footer-user">
                            <div className="admin-sidebar-footer-user-info">
                                <span className="admin-sidebar-footer-user-name">
                                    {usuario.nombre} {usuario.apellido}
                                </span>
                                {usuario.emailVerificado !== undefined && (
                                    <span 
                                        className={`admin-sidebar-footer-user-icon ${usuario.emailVerificado ? "verified" : "unverified"}`}
                                        title={usuario.emailVerificado ? "Email Verificado" : "Email No Verificado"}
                                    >
                                        {usuario.emailVerificado ? "✓" : "⚠"}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="admin-sidebar-footer-logout"
                            >
                                Cerrar Sesión
                            </button>
                            <button
                                onClick={() => navigate("/")}
                                className="btn-landing-link"
                            >
                                Volver al Landing
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {/* Contenido principal */}
            <div className="admin-content">
                {/* Navbar superior */}
                <header className="admin-header">
                    <h1 className="admin-header-title">
                        Panel de Administración
                    </h1>
                    {tiendaUsuario?.nombreUrl && (
                        <Link 
                            to={`/tienda/${tiendaUsuario.nombreUrl}/home`} 
                            className="btn-tienda-link"
                        >
                            Ir a la tienda
                        </Link>
                    )}
                </header>

                {/* Contenido de la página */}
                <main className="admin-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;

