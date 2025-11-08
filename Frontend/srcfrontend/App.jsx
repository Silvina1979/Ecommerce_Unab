import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login";
import Catalogo from "./pages/Catalogo";
import Carrito from "./pages/Carrito";
import Checkout from "./pages/Checkout";

/**
* Componente App
* 
* Componente principal de la aplicación que configura el enrutamiento.
* Define todas las rutas disponibles en la aplicación utilizando React Router.
* Cada ruta está asociada a un componente de página específico.
* 
* Rutas disponibles:
* - "/" - Página principal (Home)
* - "/login" - Página de inicio de sesión
* - "/catalogo" - Catálogo de productos
* - "/carrito" - Carrito de compras
* - "/checkout" - Proceso de finalización de compra
*/

function App() {
  return (
      // Router principal que habilita el enrutamiento en toda la aplicación
      <Router>
        {/* Contenedor de todas las rutas definidas */}
        <Routes>

          {/* Ruta raíz: Página principal del ecommerce */}
          <Route path="/" element={<Home />} />

          {/* Ruta para la página de inicio de sesión */}
          <Route path="/login" element={<Login />} />

          {/* Ruta para el catálogo completo de productos */}
          <Route path="/catalogo" element={<Catalogo />} />

          {/* Ruta para el carrito de compras del usuario */}
          <Route path="/carrito" element={<Carrito />} />

          {/* Ruta para el proceso de checkout (finalización de compra) */}
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </Router>
  );
}

export default App;
