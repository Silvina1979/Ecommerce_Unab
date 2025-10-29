import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Catalogo from "./pages/Catalogo";
import Carrito from "./pages/Carrito";
import Checkout from "./pages/Checkout";
import { SearchProvider } from "./context/SearchContext";

function App() {
  return (
    <SearchProvider> {/* Para acceder y manejar el estado de búsqueda global de la aplicación */}
      <Router> {/* Envolvemos la aplicación con Router */}
        <Routes>{/* Definimos las rutas de la aplicación */}

          {/* Ruta para la página principal */}
          <Route path="/" element={<Home />} /> {/* La ruta "/" es redirige a la página principal */}

          {/* Ruta para el Login */}
          <Route path="/login" element={<Login />} />

          {/* Ruta para ver el catalogo de todos los productos */}
          <Route path="/catalogo" element={<Catalogo />} />

          {/* Ruta para ver el carrito de compras */}
          <Route path="/carrito" element={<Carrito />} />

          {/* Ruta para ver el chekout */}
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </Router>
    </SearchProvider>
  );
}

export default App;
