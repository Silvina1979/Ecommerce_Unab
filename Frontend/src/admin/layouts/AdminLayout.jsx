import { Link, Outlet, useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
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
    const location = useLocation();
    const navigate = useNavigate();

    // Obtener el nombreTienda de los params o de la tienda del usuario
    const tiendaActual = nombreTienda || tiendaUsuario?.nombreUrl || tiendaUsuario?.nombreTienda || 'tienda';

    // Estado para controlar si el menú de productos está abierto
    const [productosMenuAbierto, setProductosMenuAbierto] = useState(false);

    // Verificar si estamos en alguna ruta de productos
    useEffect(() => {
        const rutaActual = location.pathname;
        const estaEnProductos = rutaActual.includes('/productos/crear') || rutaActual.includes('/productos/editar');
        setProductosMenuAbierto(estaEnProductos);
    }, [location.pathname]);

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
                    <div className="admin-sidebar-submenu">
                        <div 
                            className="admin-sidebar-submenu-title"
                            onClick={() => setProductosMenuAbierto(!productosMenuAbierto)}
                            style={{ cursor: 'pointer' }}
                        >
                            📦 Productos {productosMenuAbierto ? '▼' : '▶'}
                        </div>
                        <div 
                            className={`admin-sidebar-submenu-items ${productosMenuAbierto ? 'open' : 'closed'}`}
                        >
                            <Link 
                                to={`/admin/${tiendaActual}/productos/crear`}
                                className="admin-sidebar-link admin-sidebar-sublink"
                                onClick={() => setProductosMenuAbierto(true)}
                            >
                                ➕ Crear Productos
                            </Link>
                            <Link 
                                to={`/admin/${tiendaActual}/productos/editar`}
                                className="admin-sidebar-link admin-sidebar-sublink"
                                onClick={() => setProductosMenuAbierto(true)}
                            >
                                ✏️ Editar Productos
                            </Link>
                        </div>
                    </div>
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

