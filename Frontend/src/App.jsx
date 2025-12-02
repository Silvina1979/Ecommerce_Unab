import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./tienda/contexts/AuthContext";
import { TiendaWrapper } from "./tienda/contexts/TiendaWrapper";
import { NotificationProvider } from "./contexts/NotificationContext";

// Rutas de protected
import ProtectedRoute from "./components/ProtectedRoute";

// Rutas de landing
import Landing from "./landing/pages/Landing.jsx";
import Login from "./landing/components/Login.jsx";

// Rutas de admin
import AdminLayout from "./admin/layouts/AdminLayout.jsx";
import AdminDashboard from "./admin/pages/AdminDashboard.jsx";
import AdminConfiguracion from "./admin/pages/AdminConfiguracion.jsx";
import AdminCrearProductos from "./admin/pages/AdminCrearProductos.jsx";
import AdminEditarProductos from "./admin/pages/AdminEditarProductos.jsx";
import AdminPedidos from "./admin/pages/AdminPedidos.jsx";
import AdminCategorias from "./admin/pages/AdminCategorias.jsx";

// Rutas de tienda
import Home from "./tienda/pages/Home.jsx";
import HomeCategoria from "./tienda/pages/HomeCategoria.jsx";
import Catalogo from "./tienda/pages/Catalogo.jsx";
import Carrito from "./tienda/pages/Carrito.jsx";
import Checkout from "./tienda/pages/Checkout.jsx";
import VerUsuarios from "./tienda/pages/VerUsuarios.jsx";
import LoginComprador from "./tienda/pages/LoginComprador.jsx";


/**
* Componente App
* 
* Componente principal de la aplicación que configura el enrutamiento.
* Define todas las rutas disponibles en la aplicación utilizando React Router.
* Cada ruta está asociada a un componente de página específico.
* 
* Contextos proporcionados:
* - AuthProvider: Gestiona la autenticación y el token JWT
* - TiendaWrapper: Proporciona el contexto de tienda, detectando automáticamente el nombreTienda de la URL
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
        {/* Provider de notificaciones: Gestiona notificaciones globales */}
        <NotificationProvider>
          {/* Provider de autenticación: Gestiona token JWT y usuario autenticado */}
          <AuthProvider>
            {/* Wrapper que proporciona el contexto de tienda a toda la aplicación */}
            <TiendaWrapper>
            {/* Contenedor de todas las rutas definidas */}
            <Routes>

              {/* Ruta raíz: Landing page */}
              <Route path="/" element={<Landing />} />

              {/* Rutas públicas */}
              <Route path="/login" element={<Login />} />

              {/* Rutas de tienda con nombreTienda (para compradores) */}
              <Route path="/tienda/:nombreTienda/home" element={<Home />} />
              <Route path="/tienda/:nombreTienda/home/categoria/:categoriaNombre" element={<HomeCategoria />} />
              <Route path="/tienda/:nombreTienda/login" element={<LoginComprador />} />
              <Route path="/tienda/:nombreTienda/catalogo" element={<Catalogo />} />
              <Route path="/tienda/:nombreTienda/carrito" element={<Carrito />} />
              <Route path="/tienda/:nombreTienda/checkout" element={<Checkout />} />
              <Route path="/tienda/:nombreTienda/checkout" element={<VerUsuarios />} />

              {/* Rutas del panel administrativo (requieren autenticación y ser vendedor) */}
              <Route 
                path="/admin/:nombreTienda" 
                element={
                  <ProtectedRoute requireVendedor={true}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="configuracion" element={<AdminConfiguracion />} />
                <Route path="productos/crear" element={<AdminCrearProductos />} />
                <Route path="productos/editar" element={<AdminEditarProductos />} />
                <Route path="pedidos" element={<AdminPedidos />} />
                <Route path="categorias" element={<AdminCategorias />} />
                {/* Más rutas del admin se agregarán aquí */}
              </Route>
              
              {/* Ruta alternativa del admin sin nombreTienda (compatibilidad) */}
              <Route 
                path="/admin/*" 
                element={
                  <ProtectedRoute requireVendedor={true}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<AdminDashboard />} />
                {/* Más rutas del admin se agregarán aquí */}
              </Route>
            </Routes>
            </TiendaWrapper>
          </AuthProvider>
        </NotificationProvider>
      </Router>
  );
}

export default App;
