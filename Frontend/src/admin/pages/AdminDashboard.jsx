import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../tienda/contexts/AuthContext";
import "../styles/AdminDashboard.css";

/**
 * Dashboard del panel administrativo
 * 
 * Muestra estadísticas y resumen de la tienda del vendedor
 */
function AdminDashboard() {
    const { usuario, tiendaUsuario } = useAuth();
    const { nombreTienda } = useParams();
    const navigate = useNavigate();
    const [tienda, setTienda] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // El contexto ya carga la tienda automáticamente al iniciar sesión
        // Solo necesitamos usar la tienda del contexto
        if (tiendaUsuario) {
            setTienda(tiendaUsuario);
        }
        setLoading(false);
    }, [tiendaUsuario]);

    if (loading) {
        return <div className="dashboard-loading">Cargando...</div>;
    }

    const getVerificationBadgeClass = () => {
        if (usuario?.emailVerificado === undefined) return "unknown";
        return usuario.emailVerificado ? "verified" : "unverified";
    };

    return (
        <div>
            <div className="dashboard-header">
                <h2 className="dashboard-title">Dashboard</h2>
                {usuario && (
                    <div className={`dashboard-verification-badge ${getVerificationBadgeClass()}`}>
                        <span className={`dashboard-verification-icon ${getVerificationBadgeClass()}`}>
                            {usuario.emailVerificado !== undefined
                                ? (usuario.emailVerificado ? "✓" : "⚠")
                                : "?"}
                        </span>
                        <span className={`dashboard-verification-text ${getVerificationBadgeClass()}`}>
                            {usuario.emailVerificado !== undefined
                                ? (usuario.emailVerificado 
                                    ? "Email Verificado" 
                                    : "Email No Verificado")
                                : "Estado de verificación de email desconocido"}
                        </span>
                    </div>
                )}
            </div>

            {tienda ? (
                <div>
                    <div className="dashboard-tienda-card">
                        <h3>Mi Tienda</h3>
                        <p><strong>Nombre:</strong> {tienda.nombreFantasia}</p>
                        <p><strong>URL:</strong> /tienda/{tienda.nombreUrl}</p>
                        {tienda.descripcion && (
                            <p><strong>Descripción:</strong> {tienda.descripcion}</p>
                        )}
                    </div>

                    <div className="dashboard-stats-grid">
                        <div className="dashboard-stat-card products">
                            <h4>Productos</h4>
                            <p className="dashboard-stat-value">0</p>
                            <p className="dashboard-stat-label">Total de productos</p>
                        </div>

                        <div className="dashboard-stat-card orders">
                            <h4>Pedidos</h4>
                            <p className="dashboard-stat-value">0</p>
                            <p className="dashboard-stat-label">Pedidos pendientes</p>
                        </div>

                        <div className="dashboard-stat-card sales">
                            <h4>Ventas</h4>
                            <p className="dashboard-stat-value">$0</p>
                            <p className="dashboard-stat-label">Total vendido</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="dashboard-empty">
                    <h3>Aún no tienes una tienda</h3>
                    <p>Crea tu tienda para comenzar a vender productos</p>
                    
                    <div className="dashboard-empty-actions">
                        <button
                            onClick={() => {
                                const tiendaActual = nombreTienda || "tienda";
                                navigate(`/admin/${tiendaActual}/configuracion`);
                            }}
                            className="dashboard-btn dashboard-btn-primary"
                        >
                            Crear Nueva Tienda
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;

