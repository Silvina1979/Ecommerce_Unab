import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../tienda/contexts/AuthContext";
import { getProductosByTienda, getProductoById, updateProducto, buscarProductos, getProductosByCategoria, deleteProducto } from "../../tienda/services/productos";
import { getCategoriasByTienda } from "../../tienda/services/categorias";
import { useNotifications } from "../../contexts/NotificationContext";
import "../styles/AdminEditarProductos.css";

/**
 * Página de edición de productos
 * 
 * Permite ver, filtrar, buscar y editar productos de la tienda
 */
function AdminEditarProductos() {
    const { usuario, tiendaUsuario, loading: authLoading, isAuthenticated } = useAuth();
    const { nombreTienda } = useParams();
    const navigate = useNavigate();
    const { success: showSuccess, error: showError } = useNotifications();
    
    const [loading, setLoading] = useState(false);
    const [cargandoProductos, setCargandoProductos] = useState(true);
    const [productos, setProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [categorias, setCategorias] = useState([]);
    
    // Estados de filtros
    const [filtroCategoria, setFiltroCategoria] = useState("");
    const [busquedaNombre, setBusquedaNombre] = useState("");
    
    // Estados del modal
    const [modalAbierto, setModalAbierto] = useState(false);
    const [productoEditando, setProductoEditando] = useState(null);
    const [editando, setEditando] = useState(false);
    
    // Estados del formulario de edición
    const [nombreEdit, setNombreEdit] = useState("");
    const [descripcionEdit, setDescripcionEdit] = useState("");
    const [precioEdit, setPrecioEdit] = useState("");
    const [stockEdit, setStockEdit] = useState("");
    const [categoriaIdEdit, setCategoriaIdEdit] = useState("");
    const [imagenEdit, setImagenEdit] = useState(null);
    const [imagenPreviewEdit, setImagenPreviewEdit] = useState(null);
    
    // Redirigir si no está autenticado
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate("/login");
        }
    }, [authLoading, isAuthenticated, navigate]);

    // Cargar categorías
    useEffect(() => {
        const cargarCategorias = async () => {
            if (!tiendaUsuario?.nombreUrl) return;
            
            try {
                const categoriasData = await getCategoriasByTienda(tiendaUsuario.nombreUrl);
                setCategorias(categoriasData);
            } catch (error) {
                console.error("Error cargando categorías:", error);
            }
        };

        if (tiendaUsuario?.nombreUrl) {
            cargarCategorias();
        }
    }, [tiendaUsuario]);

    // Cargar productos
    useEffect(() => {
        const cargarProductos = async () => {
            if (!tiendaUsuario?.nombreUrl) {
                setCargandoProductos(false);
                return;
            }

            try {
                setCargandoProductos(true);
                const productosData = await getProductosByTienda(tiendaUsuario.nombreUrl);
                setProductos(productosData);
                setProductosFiltrados(productosData);
            } catch (error) {
                console.error("Error cargando productos:", error);
                showError("Error", "No se pudieron cargar los productos.");
            } finally {
                setCargandoProductos(false);
            }
        };

        if (tiendaUsuario?.nombreUrl) {
            cargarProductos();
        }
    }, [tiendaUsuario, showError]);

    // Aplicar filtros
    useEffect(() => {
        let productosFiltrados = [...productos];

        // Filtro por categoría
        if (filtroCategoria) {
            productosFiltrados = productosFiltrados.filter(
                p => p.categoriaId === parseInt(filtroCategoria)
            );
        }

        // Búsqueda por nombre
        if (busquedaNombre.trim()) {
            const termino = busquedaNombre.toLowerCase().trim();
            productosFiltrados = productosFiltrados.filter(
                p => p.nombre.toLowerCase().includes(termino)
            );
        }

        setProductosFiltrados(productosFiltrados);
    }, [filtroCategoria, busquedaNombre, productos]);

    const abrirModal = async (producto) => {
        try {
            // Cargar datos completos del producto
            const productoCompleto = await getProductoById(tiendaUsuario.nombreUrl, producto.id);
            setProductoEditando(productoCompleto);
            setNombreEdit(productoCompleto.nombre || "");
            setDescripcionEdit(productoCompleto.descripcion || "");
            setPrecioEdit(productoCompleto.precio?.toString() || "");
            setStockEdit(productoCompleto.stock?.toString() || "");
            setCategoriaIdEdit(productoCompleto.categoriaId?.toString() || "");
            setImagenPreviewEdit(productoCompleto.imagen || null);
            setImagenEdit(null);
            setModalAbierto(true);
        } catch (error) {
            console.error("Error cargando producto:", error);
            showError("Error", "No se pudo cargar la información del producto.");
        }
    };

    const cerrarModal = () => {
        setModalAbierto(false);
        setProductoEditando(null);
        setEditando(false);
        setNombreEdit("");
        setDescripcionEdit("");
        setPrecioEdit("");
        setStockEdit("");
        setCategoriaIdEdit("");
        setImagenEdit(null);
        setImagenPreviewEdit(null);
    };

    const iniciarEdicion = () => {
        setEditando(true);
    };

    const cancelarEdicion = () => {
        if (productoEditando) {
            setNombreEdit(productoEditando.nombre || "");
            setDescripcionEdit(productoEditando.descripcion || "");
            setPrecioEdit(productoEditando.precio?.toString() || "");
            setStockEdit(productoEditando.stock?.toString() || "");
            setCategoriaIdEdit(productoEditando.categoriaId?.toString() || "");
            setImagenPreviewEdit(productoEditando.imagen || null);
            setImagenEdit(null);
        }
        setEditando(false);
    };

    const handleImagenChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                showError("Error", "El archivo debe ser una imagen");
                return;
            }
            
            if (file.size > 5 * 1024 * 1024) {
                showError("Error", "La imagen no debe superar los 5MB");
                return;
            }
            
            setImagenEdit(file);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagenPreviewEdit(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGuardar = async () => {
        if (!productoEditando) return;

        // Validaciones
        if (!nombreEdit.trim()) {
            showError("Error", "El nombre del producto es obligatorio");
            return;
        }

        if (nombreEdit.trim().length < 3 || nombreEdit.trim().length > 100) {
            showError("Error", "El nombre debe tener entre 3 y 100 caracteres");
            return;
        }

        const precioNum = parseInt(precioEdit);
        if (!precioEdit || isNaN(precioNum) || precioNum < 1) {
            showError("Error", "El precio debe ser un número entero mayor o igual a 1");
            return;
        }

        const stockNum = parseInt(stockEdit);
        if (stockEdit === "" || isNaN(stockNum) || stockNum < 1) {
            showError("Error", "El stock debe ser un número mayor o igual a 1");
            return;
        }

        if (descripcionEdit && descripcionEdit.length > 500) {
            showError("Error", "La descripción no puede superar los 500 caracteres");
            return;
        }

        if (!categoriaIdEdit) {
            showError("Error", "Debes seleccionar una categoría");
            return;
        }

        setLoading(true);

        try {
            const datosActualizacion = {
                nombre: nombreEdit.trim(),
                descripcion: descripcionEdit.trim() || null,
                precio: precioNum,
                stock: stockNum,
                categoriaId: parseInt(categoriaIdEdit)
            };

            const productoActualizado = await updateProducto(
                tiendaUsuario.nombreUrl,
                productoEditando.id,
                datosActualizacion
            );

            // Actualizar la lista de productos
            setProductos(productos.map(p => 
                p.id === productoActualizado.id ? productoActualizado : p
            ));

            showSuccess("Producto Actualizado", `El producto "${productoActualizado.nombre}" ha sido actualizado exitosamente`);
            setEditando(false);
            cerrarModal();
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            
            let mensajeError = "Error al actualizar el producto. Intenta nuevamente.";
            
            if (error.response?.status === 400) {
                mensajeError = error.response?.data?.message || "Los datos enviados no son válidos.";
            } else if (error.response?.data?.message) {
                mensajeError = error.response.data.message;
            }
            
            showError("Error al actualizar producto", mensajeError);
        } finally {
            setLoading(false);
        }
    };

    const handleEliminar = async () => {
        if (!productoEditando) return;

        // Confirmar eliminación
        if (!window.confirm(`¿Estás seguro de que deseas eliminar el producto "${productoEditando.nombre}"? Esta acción no se puede deshacer.`)) {
            return;
        }

        setLoading(true);

        try {
            await deleteProducto(tiendaUsuario.nombreUrl, productoEditando.id);

            // Remover el producto de la lista
            setProductos(productos.filter(p => p.id !== productoEditando.id));

            showSuccess("Producto Eliminado", `El producto "${productoEditando.nombre}" ha sido eliminado exitosamente`);
            cerrarModal();
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            
            let mensajeError = "Error al eliminar el producto. Intenta nuevamente.";
            
            if (error.response?.status === 404) {
                mensajeError = "El producto no fue encontrado.";
            } else if (error.response?.data?.message) {
                mensajeError = error.response.data.message;
            }
            
            showError("Error al eliminar producto", mensajeError);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="editar-productos-loading">
                <div className="editar-productos-loading-content">
                    <div className="editar-productos-loading-title">Cargando...</div>
                </div>
            </div>
        );
    }

    if (!usuario || !usuario.dni) {
        return (
            <div className="editar-productos-error">
                <h2>Error</h2>
                <p>No se pudo obtener la información del usuario.</p>
            </div>
        );
    }

    if (!tiendaUsuario) {
        return (
            <div className="editar-productos-error">
                <h2>Tienda no encontrada</h2>
                <p>Debes crear una tienda antes de poder gestionar productos.</p>
            </div>
        );
    }

    return (
        <div className="editar-productos-container">
            <h2 className="editar-productos-title">Editar Productos</h2>

            {/* Filtros y búsqueda */}
            <div className="editar-productos-filtros">
                <div className="editar-productos-filtro-grupo">
                    <label className="editar-productos-label">Filtrar por categoría:</label>
                    <select
                        value={filtroCategoria}
                        onChange={(e) => setFiltroCategoria(e.target.value)}
                        className="editar-productos-select"
                    >
                        <option value="">Todas las categorías</option>
                        {categorias.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="editar-productos-filtro-grupo">
                    <label className="editar-productos-label">Buscar por nombre:</label>
                    <input
                        type="text"
                        value={busquedaNombre}
                        onChange={(e) => setBusquedaNombre(e.target.value)}
                        placeholder="Buscar producto..."
                        className="editar-productos-input-busqueda"
                    />
                </div>
            </div>

            {/* Lista de productos */}
            {cargandoProductos ? (
                <div className="editar-productos-loading-productos">
                    Cargando productos...
                </div>
            ) : productosFiltrados.length === 0 ? (
                <div className="editar-productos-vacio">
                    <p>No se encontraron productos{productos.length === 0 ? "" : " con los filtros aplicados"}.</p>
                </div>
            ) : (
                <div className="editar-productos-grid">
                    {productosFiltrados.map((producto) => (
                        <div
                            key={producto.id}
                            className="editar-productos-card"
                            onClick={() => abrirModal(producto)}
                        >
                            <div className="editar-productos-card-imagen">
                                <img
                                    src={producto.imagen || "https://res.cloudinary.com/dacnqinsu/image/upload/v1/default-product.png"}
                                    alt={producto.nombre}
                                />
                            </div>
                            <div className="editar-productos-card-info">
                                <h3 className="editar-productos-card-nombre">{producto.nombre}</h3>
                                <p className="editar-productos-card-precio">${producto.precio}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de edición */}
            {modalAbierto && productoEditando && (
                <div className="editar-productos-modal-overlay" onClick={cerrarModal}>
                    <div className="editar-productos-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="editar-productos-modal-header">
                            <h3>{editando ? "Editar Producto" : "Detalles del Producto"}</h3>
                            <button
                                className="editar-productos-modal-cerrar"
                                onClick={cerrarModal}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="editar-productos-modal-content">
                            {editando ? (
                                <>
                                    <div className="editar-productos-form-group">
                                        <label className="editar-productos-label">Nombre *</label>
                                        <input
                                            type="text"
                                            value={nombreEdit}
                                            onChange={(e) => setNombreEdit(e.target.value)}
                                            className="editar-productos-input"
                                            maxLength={100}
                                        />
                                    </div>

                                    <div className="editar-productos-form-group">
                                        <label className="editar-productos-label">Descripción</label>
                                        <textarea
                                            value={descripcionEdit}
                                            onChange={(e) => setDescripcionEdit(e.target.value)}
                                            className="editar-productos-textarea"
                                            rows="3"
                                            maxLength={500}
                                        />
                                    </div>

                                    <div className="editar-productos-form-row">
                                        <div className="editar-productos-form-group">
                                            <label className="editar-productos-label">Precio *</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={precioEdit}
                                                onChange={(e) => setPrecioEdit(e.target.value)}
                                                className="editar-productos-input"
                                            />
                                        </div>

                                        <div className="editar-productos-form-group">
                                            <label className="editar-productos-label">Stock *</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={stockEdit}
                                                onChange={(e) => setStockEdit(e.target.value)}
                                                className="editar-productos-input"
                                            />
                                        </div>
                                    </div>

                                    <div className="editar-productos-form-group">
                                        <label className="editar-productos-label">Categoría *</label>
                                        <select
                                            value={categoriaIdEdit}
                                            onChange={(e) => setCategoriaIdEdit(e.target.value)}
                                            className="editar-productos-select"
                                        >
                                            <option value="">Selecciona una categoría</option>
                                            {categorias.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="editar-productos-form-group">
                                        <label className="editar-productos-label">Imagen</label>
                                        {imagenPreviewEdit && (
                                            <div className="editar-productos-imagen-preview">
                                                <img src={imagenPreviewEdit} alt="Preview" />
                                            </div>
                                        )}
                                        <small className="editar-productos-help-text">
                                            La imagen no se puede editar desde aquí. Para cambiar la imagen, elimina y crea el producto nuevamente.
                                        </small>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="editar-productos-detalle-imagen">
                                        <img
                                            src={productoEditando.imagen || "https://res.cloudinary.com/dacnqinsu/image/upload/v1/default-product.png"}
                                            alt={productoEditando.nombre}
                                        />
                                    </div>
                                    <div className="editar-productos-detalle-info">
                                        <p><strong>Nombre:</strong> {productoEditando.nombre}</p>
                                        <p><strong>Precio:</strong> ${productoEditando.precio}</p>
                                        <p><strong>Stock:</strong> {productoEditando.stock}</p>
                                        <p><strong>Descripción:</strong> {productoEditando.descripcion || "Sin descripción"}</p>
                                        <p><strong>Categoría:</strong> {
                                            categorias.find(c => c.id === productoEditando.categoriaId)?.nombre || "Sin categoría"
                                        }</p>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="editar-productos-modal-footer">
                            {editando ? (
                                <>
                                    <button
                                        onClick={handleGuardar}
                                        disabled={loading}
                                        className="editar-productos-btn editar-productos-btn-guardar"
                                    >
                                        {loading ? "Guardando..." : "Guardar Cambios"}
                                    </button>
                                    <button
                                        onClick={cancelarEdicion}
                                        disabled={loading}
                                        className="editar-productos-btn editar-productos-btn-cancelar"
                                    >
                                        Cancelar
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={iniciarEdicion}
                                        className="editar-productos-btn editar-productos-btn-editar"
                                    >
                                        Editar Producto
                                    </button>
                                    <button
                                        onClick={handleEliminar}
                                        disabled={loading}
                                        className="editar-productos-btn editar-productos-btn-eliminar"
                                    >
                                        {loading ? "Eliminando..." : "🗑️ Eliminar Producto"}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminEditarProductos;

