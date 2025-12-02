import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../tienda/contexts/AuthContext";
import { getTiendaByVendedor, getTiendaBySlug } from "../../tienda/services/tiendas";
import { useNotifications } from "../../contexts/NotificationContext";
import "../styles/AdminDashboard.css";

/**
 * Dashboard del panel administrativo
 * 
 * Muestra estadísticas y resumen de la tienda del vendedor
 */
function AdminDashboard() {
    const { usuario, tiendaUsuario, setTiendaUsuario } = useAuth();
    const { nombreTienda } = useParams();
    const navigate = useNavigate();
    const { success: showSuccess, error: showError } = useNotifications();
    const [tienda, setTienda] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mostrarFormularioNombreUrl, setMostrarFormularioNombreUrl] = useState(false);
    const [nombreUrlInput, setNombreUrlInput] = useState("");
    const [cargandoTienda, setCargandoTienda] = useState(false);

    useEffect(() => {
        // El contexto ya carga la tienda automáticamente al iniciar sesión
        // Solo necesitamos usar la tienda del contexto
        if (tiendaUsuario) {
            setTienda(tiendaUsuario);
            setLoading(false);
        } else {
            // Si no hay tienda en el contexto, verificar localStorage como respaldo
            const tiendaGuardada = localStorage.getItem("auth_tienda");
            if (tiendaGuardada && usuario?.dni) {
                try {
                    const tienda = JSON.parse(tiendaGuardada);
                    // Verificar que la tienda pertenezca al usuario
                    const tiendaVendedorDni = typeof tienda.vendedorDni === 'string' 
                        ? parseInt(tienda.vendedorDni) 
                        : tienda.vendedorDni;
                    const usuarioDni = typeof usuario.dni === 'string' 
                        ? parseInt(usuario.dni) 
                        : usuario.dni;
                    
                    if (tiendaVendedorDni === usuarioDni) {
                        setTienda(tienda);
                    }
                } catch (e) {
                    console.error("Error parseando tienda guardada:", e);
                }
            }
            setLoading(false);
        }
    }, [usuario, tiendaUsuario]);

    const handleCargarTienda = async () => {
        if (!nombreUrlInput.trim()) {
            showError("Error", "Por favor ingresa el nombre URL de tu tienda");
            return;
        }

        setCargandoTienda(true);
        try {
            const tiendaCargada = await getTiendaBySlug(nombreUrlInput.trim());
            
            // Verificar que la tienda pertenezca al usuario actual
            const tiendaVendedorDni = typeof tiendaCargada.vendedorDni === 'string'
                ? parseInt(tiendaCargada.vendedorDni)
                : tiendaCargada.vendedorDni;
            const usuarioDni = typeof usuario.dni === 'string'
                ? parseInt(usuario.dni)
                : usuario.dni;
            
            if (tiendaVendedorDni === usuarioDni) {
                // La tienda pertenece al usuario, guardarla
                setTienda(tiendaCargada);
                setTiendaUsuario(tiendaCargada);
                localStorage.setItem("auth_tienda", JSON.stringify(tiendaCargada));
                localStorage.setItem("auth_userType", "vendedor");
                showSuccess("Tienda Cargada", "Tu tienda ha sido cargada exitosamente");
                setMostrarFormularioNombreUrl(false);
                setNombreUrlInput("");
            } else {
                showError("Error", "Esta tienda no pertenece a tu cuenta. Verifica el nombre URL.");
            }
        } catch (error) {
            console.error("Error cargando tienda:", error);
            if (error.response?.status === 404) {
                showError("Error", "No se encontró una tienda con ese nombre URL. Verifica que esté correcto.");
            } else {
                showError("Error", "No se pudo cargar la tienda. Verifica el nombre URL e intenta nuevamente.");
            }
        } finally {
            setCargandoTienda(false);
        }
    };

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
                    <p>
                        {mostrarFormularioNombreUrl 
                            ? "Ingresa el nombre URL (slug) de tu tienda existente"
                            : "¿Ya tienes una tienda? Puedes cargarla ingresando su nombre URL"}
                    </p>
                    
                    {!mostrarFormularioNombreUrl ? (
                        <div className="dashboard-empty-actions">
                            <button
                                onClick={() => setMostrarFormularioNombreUrl(true)}
                                className="dashboard-btn dashboard-btn-primary"
                            >
                                Cargar Mi Tienda Existente
                            </button>
                            <button
                                onClick={() => {
                                    const tiendaActual = nombreTienda || "tienda";
                                    navigate(`/admin/${tiendaActual}/configuracion`);
                                }}
                                className="dashboard-btn dashboard-btn-secondary"
                            >
                                Crear Nueva Tienda
                            </button>
                        </div>
                    ) : (
                        <div className="dashboard-form-container">
                            <div>
                                <input
                                    type="text"
                                    value={nombreUrlInput}
                                    onChange={(e) => setNombreUrlInput(e.target.value)}
                                    placeholder="Ej: lucca-helados"
                                    className="dashboard-form-input"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleCargarTienda();
                                        }
                                    }}
                                />
                            </div>
                            <div className="dashboard-form-actions">
                                <button
                                    onClick={handleCargarTienda}
                                    disabled={cargandoTienda || !nombreUrlInput.trim()}
                                    className={`dashboard-btn ${cargandoTienda || !nombreUrlInput.trim() ? "dashboard-btn-gray" : "dashboard-btn-primary"}`}
                                >
                                    {cargandoTienda ? "Cargando..." : "Cargar Tienda"}
                                </button>
                                <button
                                    onClick={() => {
                                        setMostrarFormularioNombreUrl(false);
                                        setNombreUrlInput("");
                                    }}
                                    className="dashboard-btn dashboard-btn-gray"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;

