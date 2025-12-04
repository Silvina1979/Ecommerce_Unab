import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { obtenerCarrito, eliminarItemCarrito } from "../services/carrito.js";
import { useNotifications } from "../../contexts/NotificationContext.jsx";
import Header from "../components/Header.jsx";
import "../styles/Carrito.css";
import Footer_Landing from "../../landing/components/Footer_Landing.jsx";

/**
* Componente Carrito
* * Muestra la página del carrito de compras del usuario.
* Renderiza una lista de productos agregados al carrito obtenida del backend
* y un botón para proceder al checkout.
*/

function Carrito() {
    const { nombreTienda } = useParams();
    const { usuario, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { error: showError, success: showSuccess } = useNotifications();

    // Estado para items del carrito y totales
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    // Cargar carrito al montar el componente si hay usuario
    useEffect(() => {
        if (isAuthenticated && usuario && nombreTienda) {
            cargarCarrito();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated, usuario, nombreTienda]);

    // Calcular el total cada vez que cambian los items
    useEffect(() => {
        // El backend ya manda 'subtotal', pero sumamos aquí para el total general
        const nuevoTotal = items.reduce((acc, item) => acc + (item.subtotal || 0), 0);
        setTotal(nuevoTotal);
    }, [items]);

    const cargarCarrito = async () => {
        try {
            setLoading(true);
            const data = await obtenerCarrito(nombreTienda, usuario.dni);
            setItems(data || []);
        } catch (error) {
            console.error("Error al cargar carrito:", error);
            // Si es 404 puede ser que esté vacío o no exista, no mostramos error crítico
            if (error.response?.status !== 404) {
                showError("Error", "No se pudo cargar el carrito.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEliminarItem = async (idItem) => {
        if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;

        try {
            await eliminarItemCarrito(nombreTienda, idItem);
            // Actualizamos el estado local filtrando el item eliminado
            setItems(prev => prev.filter(item => item.idItem !== idItem));
            showSuccess("Eliminado", "Producto eliminado del carrito");
        } catch (error) {
            console.error("Error al eliminar item:", error);
            showError("Error", "No se pudo eliminar el producto.");
        }
    };

    const irACheckout = () => {
        if (items.length === 0) {
            showError("Carrito vacío", "Agrega productos antes de realizar la compra.");
            return;
        }
        navigate(`/tienda/${nombreTienda}/checkout`);
    };

    // Si no está logueado, mostrar aviso
    if (!isAuthenticated) {
        return (
            <div>
                <Header />
                <div className="main-carrito" style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <h2>Inicia sesión para ver tu carrito</h2>
                    <Link to={`/tienda/${nombreTienda}/login`} className="cart-btn" style={{ maxWidth: '200px', marginTop: '20px', textDecoration: 'none', display: 'inline-block' }}>
                        Iniciar Sesión
                    </Link>
                </div>
                <Footer_Landing />
            </div>
        );
    }

    return (
        <div>
            {/* Header de navegación de la aplicación */}
            <Header />

            {/* Sección de los items del carrito */}
            <div className="main-carrito">

                <div className="items-cart-cont">
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Tu Carrito</h1>
                    
                    {loading ? (
                        <p>Cargando productos...</p>
                    ) : items.length === 0 ? (
                        <div className="items-cart" style={{ justifyContent: 'center' }}>
                            <p>No hay productos en el carrito.</p>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.idItem} className="items-cart">
                                <img 
                                    src={item.imagenProducto || "/default-product.png"} 
                                    alt={item.nombreProducto}
                                    onError={(e) => { e.target.src = "/default-product.png" }} 
                                />
                                <div style={{ flex: 1 }}>
                                    <h2 style={{ fontSize: '1.2rem', margin: '0 0 5px 0' }}>{item.nombreProducto}</h2>
                                    <p style={{ margin: 0, color: '#666' }}>Precio unitario: ${item.precioUnitario}</p>
                                    <p style={{ margin: 0, color: '#666' }}>Cantidad: {item.cantidad}</p>
                                </div>
                                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--green-650)' }}>
                                        ${item.subtotal}
                                    </span>
                                    <button 
                                        onClick={() => handleEliminarItem(item.idItem)}
                                        style={{ 
                                            background: 'transparent', 
                                            border: 'none', 
                                            color: '#dc3545', 
                                            cursor: 'pointer', 
                                            textDecoration: 'underline',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>  
            
                {/* Sección de confirmación y botón para realizar compra */}
                <div className="cart-confirm">
                    <h1>Resumen</h1>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span>Subtotal:</span>
                        <span>${total}</span>
                    </div>
                    
                    <div style={{ borderTop: '1px solid #eee', margin: '10px 0' }}></div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontWeight: 'bold', fontSize: '1.2rem' }}>
                        <span>Total:</span>
                        <span>${total}</span>
                    </div>

                    <button 
                        className="cart-btn" 
                        onClick={irACheckout}
                        disabled={items.length === 0}
                        style={{ opacity: items.length === 0 ? 0.6 : 1 }}
                    >
                        Realizar compra
                    </button>
                    
                    <Link to={`/tienda/${nombreTienda}/catalogo`} style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.9rem', color: '#666' }}>
                        Seguir comprando
                    </Link>
                </div>
            </div>

            {/* Footer de la página */}
            <Footer_Landing />
        </div>
    );
};
export default Carrito