import "../styles/Productos.css";
import { useEffect, useState } from "react";
import { getProductoById } from "../services/productos";

/**
* Componente ProductoHome

* Muestra productos para la pagina pricipal con su imagen, descripcion, precio, nombre por ID
*/

function ProductoHome({ id }) {
    // Estado para almacenar los datos del producto
    const [producto, setProducto] = useState(null);

    // Efecto que obtiene el producto por ID cuando cambia el id
    useEffect(() => {
        getProductoById(id)
        .then(setProducto)
        .catch(console.error);
    }, [id]);

    // Muestra mensaje de carga mientras se obtienen los datos
    if (!producto) return <p>Cargando productos...</p>;

    return (
        
        <div className="prod-home-container">
            {/* Imagen del producto */}
            <img src={producto.imagen} alt={producto.nombre} className="prod-home-image" />
            {/* Nombre del producto */}
            <h2 className="prod-home-nombre">{producto.nombre}</h2>
            {/* Precio del producto */}
            <p className="prod-home-precio">Precio: ${producto.precio}</p>
            {/* Stock disponible del producto */}
            <p className="prod-home-stock">Stock: {producto.stock}</p>
            {/* Descripción del producto */}
            <p className="prod-home-descripcion">Descripción: {producto.descripcion}</p>
            {/* Botón para agregar el producto al carrito */}
            <button className="prod-home-btn-carrito">Agregar al carrito</button>
        </div>
    );
}

export default ProductoHome;
