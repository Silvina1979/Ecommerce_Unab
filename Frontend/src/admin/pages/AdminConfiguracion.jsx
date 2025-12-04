import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../tienda/contexts/AuthContext";
import { createTienda, updateTienda, getTiendaByVendedor } from "../../tienda/services/tiendas";
import NotificationModal from "../../components/NotificationModal.jsx";
import "../styles/AdminConfiguracion.css";

/**
 * Página de configuración de tienda
 * 
 * Permite crear o editar la tienda del vendedor autenticado
 */
function AdminConfiguracion() {
    const { usuario, tiendaUsuario, setTiendaUsuario, loading: authLoading, isAuthenticated } = useAuth();
    const { nombreTienda } = useParams();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    
    // Estado para el modal de notificación
    const [notification, setNotification] = useState({
        isOpen: false,
        type: 'info',
        title: '',
        message: ''
    });
    
    // Estados del formulario
    const [nombreFantasia, setNombreFantasia] = useState("");
    const [nombreUrl, setNombreUrl] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [logo, setLogo] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    
    const isEditMode = !!tiendaUsuario;

    // Redirigir si no está autenticado o si aún está cargando
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate("/login");
        }
    }, [authLoading, isAuthenticated, navigate]);

    // Cargar datos de la tienda si está en modo edición
    useEffect(() => {
        if (isEditMode && tiendaUsuario) {
            setNombreFantasia(tiendaUsuario.nombreFantasia || "");
            setNombreUrl(tiendaUsuario.nombreUrl || "");
            setDescripcion(tiendaUsuario.descripcion || "");
            if (tiendaUsuario.logo) {
                setLogoPreview(tiendaUsuario.logo);
            }
        }
    }, [isEditMode, tiendaUsuario]);

    // Generar nombreUrl automáticamente desde nombreFantasia
    const handleNombreFantasiaChange = (e) => {
        const value = e.target.value;
        setNombreFantasia(value);
        
        // Generar nombreUrl automáticamente (slug)
        if (!isEditMode) {
            const slug = value
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
                .replace(/[^a-z0-9]+/g, "-") // Reemplazar espacios y caracteres especiales con guiones
                .replace(/^-+|-+$/g, ""); // Eliminar guiones al inicio y final
            setNombreUrl(slug);
        }
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validar tipo de archivo
            if (!file.type.startsWith("image/")) {
                setError("El archivo debe ser una imagen");
                return;
            }
            
            // Validar tamaño (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError("La imagen no debe superar los 5MB");
                return;
            }
            
            setLogo(file);
            setError(null);
            
            // Crear preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setLoading(true);

        // Validaciones
        if (!nombreFantasia.trim()) {
            setError("El nombre de la tienda es obligatorio");
            setLoading(false);
            return;
        }

        if (!nombreUrl.trim()) {
            setError("El nombre de URL es obligatorio");
            setLoading(false);
            return;
        }

        // Validar formato del nombreUrl (solo letras, números y guiones)
        if (!/^[a-z0-9-]+$/.test(nombreUrl)) {
            setError("El nombre de URL solo puede contener letras minúsculas, números y guiones");
            setLoading(false);
            return;
        }

        if (!usuario?.dni) {
            setError("No se pudo obtener la información del usuario. Por favor, recarga la página o inicia sesión nuevamente.");
            setLoading(false);
            return;
        }

        try {
            // Crear FormData para multipart/form-data
            const formData = new FormData();
            
            // Crear objeto JSON con los datos de la tienda (sin logo, se envía como archivo separado)
            // Asegurar que vendedorDni sea un número (Long)
            const tiendaData = {
                nombreUrl: nombreUrl.trim(),
                nombreFantasia: nombreFantasia.trim(),
                descripcion: descripcion.trim() || null,
                vendedorDni: typeof usuario.dni === 'number' ? usuario.dni : parseInt(usuario.dni)
            };
            
            // Validar que el DNI sea un número válido
            if (isNaN(tiendaData.vendedorDni)) {
                setError("El DNI del usuario no es válido. Por favor, inicia sesión nuevamente.");
                setLoading(false);
                return;
            }
            
            // Agregar el JSON como string en el campo "tienda"
            formData.append("tienda", JSON.stringify(tiendaData));
            
            // Agregar el archivo del logo si se seleccionó uno
            if (logo) {
                formData.append("file", logo);
            }
            

            let tiendaCreada;
            
            if (isEditMode) {
                // Actualizar tienda existente
                tiendaCreada = await updateTienda(tiendaUsuario.nombreUrl, formData);
            } else {
                // Crear nueva tienda
                tiendaCreada = await createTienda(formData);
            }

            // Actualizar el contexto de autenticación
            setTiendaUsuario(tiendaCreada);
            localStorage.setItem("auth_tienda", JSON.stringify(tiendaCreada));
            localStorage.setItem("auth_userType", "vendedor");

            setSuccess(true);
            
            // Mostrar notificación de éxito
            setNotification({
                isOpen: true,
                type: 'success',
                title: isEditMode ? 'Tienda actualizada' : 'Tienda creada con éxito',
                message: isEditMode 
                    ? 'Los cambios se han guardado correctamente.' 
                    : '¡Tu tienda ha sido creada exitosamente!'
            });
            
        } catch (error) {
            console.error("Error al guardar tienda:", error);
            console.error("Error completo:", {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                message: error.message
            });
            
            // Mensajes de error más específicos
            let mensajeError = "Error al guardar la tienda. Intenta nuevamente.";
            
            if (error.response?.status === 500) {
                // Mostrar detalles del error del servidor si están disponibles
                const serverError = error.response?.data?.message || error.response?.data?.error;
                
                // Mensajes específicos según el error
                if (serverError) {
                    if (serverError.includes("verificar tu email") || serverError.includes("email")) {
                        mensajeError = "Debes verificar tu email antes de crear una tienda. Revisa tu correo electrónico para el código de verificación.";
                    } else if (serverError.includes("ACCESO DENEGADO")) {
                        mensajeError = "No tienes permisos para crear esta tienda. Verifica que estés usando la cuenta correcta.";
                    } else if (serverError.includes("ya está en uso")) {
                        mensajeError = `El nombre de URL "${nombreUrl}" ya está en uso. Por favor, elige otro nombre.`;
                    } else {
                        mensajeError = `Error del servidor: ${serverError}`;
                    }
                } else {
                    // Error 500 sin mensaje específico - probablemente email no verificado u otro error no manejado
                    mensajeError = "Error interno del servidor. Posibles causas:\n" +
                        "• Tu email no está verificado (revisa tu correo para el código de verificación)\n" +
                        "• El nombre de URL ya está en uso\n" +
                        "• Problema con la autenticación\n\n" +
                        "Verifica estos puntos e intenta nuevamente.";
                }
                
                // Log completo del error para debug
                if (import.meta.env.DEV) {
                    console.error("Error 500 completo:", error.response?.data);
                    console.error("Request config:", error.config);
                }
            } else if (error.response?.status === 400) {
                // Error 400: puede ser email no verificado u otros errores de validación
                const serverError = error.response?.data?.message || error.response?.data?.error || "";
                
                if (serverError.includes("verificar") || serverError.includes("email") || serverError.includes("verificado")) {
                    mensajeError = "Debes verificar tu email antes de crear una tienda. Revisa tu correo electrónico para el código de verificación y verifica tu cuenta.";
                } else {
                    mensajeError = serverError || "Los datos enviados no son válidos. Verifica todos los campos.";
                }
            } else if (error.response?.status === 404) {
                mensajeError = "El endpoint de tiendas no está disponible. Contacta al administrador.";
            } else if (error.response?.data?.message) {
                mensajeError = error.response.data.message;
            } else if (error.message) {
                mensajeError = error.message;
            }
            
            setError(mensajeError);
            
            // Mostrar modal de error
            setNotification({
                isOpen: true,
                type: 'error',
                title: 'Error al guardar tienda',
                message: mensajeError
            });
        } finally {
            setLoading(false);
        }
    };

    // Mostrar carga mientras se obtiene el usuario
    if (authLoading) {
        return (
            <div className="configuracion-loading">
                <div className="configuracion-loading-content">
                    <div className="configuracion-loading-title">
                        Cargando...
                    </div>
                    <div className="configuracion-loading-text">
                        Obteniendo información del usuario
                    </div>
                </div>
            </div>
        );
    }

    // Si no hay usuario después de cargar, mostrar error con información de debug
    if (!usuario || !usuario.dni) {
        // Log para debug
        console.error("Usuario no disponible:", {
            usuario,
            tieneUsuario: !!usuario,
            tieneDni: usuario?.dni,
            token: localStorage.getItem("auth_token") ? "existe" : "no existe",
            usuarioGuardado: localStorage.getItem("auth_user")
        });

        return (
            <div>
                <h2 className="configuracion-error-title">
                    Error
                </h2>
                <div className="configuracion-error-container">
                    <div className="configuracion-error-alert">
                        <strong>No se pudo obtener la información del usuario.</strong>
                        <br />
                        <small className="configuracion-error-text">
                            {!usuario 
                                ? "El usuario no está disponible. Por favor, inicia sesión nuevamente."
                                : `El usuario existe pero no tiene DNI. Usuario: ${JSON.stringify(usuario)}`
                            }
                        </small>
                    </div>
                    <div className="configuracion-error-actions">
                        <button
                            onClick={() => {
                                // Limpiar localStorage y redirigir
                                localStorage.clear();
                                navigate("/login");
                            }}
                            className="configuracion-error-btn configuracion-error-btn-primary"
                        >
                            Ir a Iniciar Sesión
                        </button>
                        <button
                            onClick={() => {
                                // Recargar la página
                                window.location.reload();
                            }}
                            className="configuracion-error-btn configuracion-error-btn-secondary"
                        >
                            Recargar Página
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="configuracion-title">
                {isEditMode ? "Editar Mi Tienda" : "Crear Mi Tienda"}
            </h2>

            <form onSubmit={handleSubmit} className="configuracion-form">
                {error && (
                    <div className="configuracion-alert error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="configuracion-alert success">
                        {isEditMode ? "Tienda actualizada exitosamente" : "Tienda creada exitosamente"}
                    </div>
                )}

                <div className="configuracion-form-group">
                    <label className="configuracion-label">
                        Nombre de la Tienda *
                    </label>
                    <input
                        type="text"
                        value={nombreFantasia}
                        onChange={handleNombreFantasiaChange}
                        placeholder="Ej: Mi Tienda Online"
                        required
                        disabled={loading}
                        className="configuracion-input"
                    />
                </div>

                <div className="configuracion-form-group">
                    <label className="configuracion-label-flex">
                        <span>Nombre de URL (slug) *</span>
                        {!isEditMode && (
                            <span className="configuracion-label-warning">
                                (No se puede editar después de crear)
                            </span>
                        )}
                    </label>
                    <input
                        type="text"
                        value={nombreUrl}
                        onChange={(e) => setNombreUrl(e.target.value)}
                        placeholder="Ej: mi-tienda-online"
                        required
                        disabled={loading || isEditMode}
                        pattern="[a-z0-9\-]+"
                        className="configuracion-input"
                    />
                    <small className="configuracion-help-text">
                        Solo letras minúsculas, números y guiones. Tu tienda estará disponible en: /tienda/{nombreUrl || "nombre-url"}
                    </small>
                </div>

                <div className="configuracion-form-group">
                    <label className="configuracion-label">
                        Descripción
                    </label>
                    <textarea
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        placeholder="Describe tu tienda..."
                        rows="4"
                        disabled={loading}
                        className="configuracion-textarea"
                    />
                </div>

                <div className="configuracion-form-group">
                    <label className="configuracion-label">
                        Logo de la Tienda
                    </label>
                    {logoPreview && (
                        <div className="configuracion-logo-preview">
                            <img
                                src={logoPreview}
                                alt="Preview del logo"
                            />
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        disabled={loading}
                        className="configuracion-file-input"
                        key={isEditMode ? `logo-${tiendaUsuario?.nombreUrl}` : 'logo-new'}
                    />
                    <small className="configuracion-help-text">
                        Formato: JPG, PNG, GIF. Tamaño máximo: 5MB
                        {isEditMode && " Puedes seleccionar un nuevo logo para reemplazar el actual."}
                    </small>
                </div>

                <div className="configuracion-form-actions">
                    <button
                        type="submit"
                        disabled={loading}
                        className="configuracion-btn configuracion-btn-submit"
                    >
                        {loading ? "Guardando..." : (isEditMode ? "Actualizar Tienda" : "Crear Tienda")}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            const tiendaActual = nombreTienda || tiendaUsuario?.nombreUrl || "tienda";
                            navigate(`/admin/${tiendaActual}/dashboard`);
                        }}
                        disabled={loading}
                        className="configuracion-btn configuracion-btn-cancel"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
            
            {/* Modal de Notificación */}
            <NotificationModal
                isOpen={notification.isOpen}
                type={notification.type}
                title={notification.title}
                message={notification.message}
                onClose={() => {
                    setNotification({ ...notification, isOpen: false });
                    // Si la operación fue exitosa, redirigir después de cerrar el modal
                    if (success && notification.type === 'success') {
                        const nombreTiendaUrl = tiendaUsuario?.nombreUrl || nombreTienda;
                        navigate(`/admin/${nombreTiendaUrl}/dashboard`);
                    }
                }}
                autoClose={notification.type === 'success' ? 2000 : notification.type === 'error' ? 5000 : 3000}
            />
        </div>
    );
}

export default AdminConfiguracion;

