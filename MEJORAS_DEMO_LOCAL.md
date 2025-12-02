# Mejoras para Presentación Local — Guía Rápida

**Objetivo:** Que el proyecto se vea profesional y funcione perfectamente en demo local.

---

## 🎯 Mejoras Rápidas (30 minutos cada una)

### 1. **Arreglar Autenticación JWT en Frontend** 🔴 VISIBLE

**Problema:** El token JWT probablemente no se guarda/valida correctamente.

**Archivo a revisar:** `Frontend/src/tienda/contexts/AuthContext.jsx`

```javascript
// AuthContext.jsx (MEJORADO)
import { createContext, useState, useEffect } from 'react';
import api from '../services/api'; // Asegurar que existe

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Cargar usuario del localStorage al iniciar
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      // Agregar token a headers por defecto
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await api.post('/api/auth/login', { email, password });
      const token = response.data.token;
      
      // Guardar token y usuario
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Obtener datos del usuario (crear endpoint GET /api/auth/me si no existe)
      const userResponse = await api.get('/api/auth/me');
      setUser(userResponse.data);
      localStorage.setItem('user', JSON.stringify(userResponse.data));
      
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await api.post('/api/auth/register', userData);
      const token = response.data.token;
      
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Auto-login después de registro
      const userResponse = await api.get('/api/auth/me');
      setUser(userResponse.data);
      localStorage.setItem('user', JSON.stringify(userResponse.data));
      
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
```

**Backend - Crear endpoint `/api/auth/me`:**

```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public UsuariosResponse getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        Usuarios usuario = usuariosRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return new UsuariosResponse(usuario);
    }
}
```

---

### 2. **Mejorar UI - Mensajes de Error Visuales** 🟡 IMPACTO ALTO

**Crear componente NotificationModal mejorado:**

`Frontend/src/components/NotificationModal.jsx`:

```javascript
import React, { useContext } from 'react';
import { Alert, Toast, ToastContainer } from 'react-bootstrap';
import { NotificationContext } from '../contexts/NotificationContext';

export const NotificationModal = () => {
  const { notifications, removeNotification } = useContext(NotificationContext);

  return (
    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
      {notifications.map((notif) => (
        <Toast
          key={notif.id}
          onClose={() => removeNotification(notif.id)}
          show={true}
          delay={5000}
          autohide
          bg={notif.type === 'error' ? 'danger' : notif.type === 'success' ? 'success' : 'info'}
        >
          <Toast.Header>
            <strong className="me-auto">
              {notif.type === 'error' ? '❌ Error' : notif.type === 'success' ? '✅ Éxito' : 'ℹ️ Información'}
            </strong>
          </Toast.Header>
          <Toast.Body className={notif.type === 'error' ? 'text-white' : ''}>
            {notif.message}
          </Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
};
```

**Crear NotificationContext si no existe:**

`Frontend/src/contexts/NotificationContext.jsx`:

```javascript
import { createContext, useState, useCallback } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
```

---

### 3. **Agregar Validaciones en Formularios** 🟡 IMPORTANTE

**Ejemplo: Formulario de registro mejorado**

```javascript
// Landing.jsx o Login.jsx (componente de registro)
import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { NotificationContext } from '../contexts/NotificationContext';

export const RegisterForm = () => {
  const { register } = useContext(AuthContext);
  const { addNotification } = useContext(NotificationContext);
  const [formData, setFormData] = useState({
    dni: '',
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.dni || !/^\d{7,8}$/.test(formData.dni)) {
      newErrors.dni = 'DNI debe tener 7-8 dígitos';
    }
    if (!formData.nombre || formData.nombre.trim().length < 2) {
      newErrors.nombre = 'Nombre debe tener al menos 2 caracteres';
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Contraseña debe tener al menos 6 caracteres';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      addNotification('Por favor corrige los errores del formulario', 'error');
      return;
    }

    const success = await register({
      dni: formData.dni,
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      password: formData.password
    });

    if (success) {
      addNotification('¡Registro exitoso!', 'success');
      // Redirigir a home/dashboard
    } else {
      addNotification('Error al registrarse', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <input
          type="text"
          className={`form-control ${errors.dni ? 'is-invalid' : ''}`}
          placeholder="DNI"
          value={formData.dni}
          onChange={(e) => setFormData({...formData, dni: e.target.value})}
        />
        {errors.dni && <div className="invalid-feedback">{errors.dni}</div>}
      </div>
      {/* Otros campos... */}
      <button type="submit" className="btn btn-primary">Registrar</button>
    </form>
  );
};
```

---

### 4. **Agregar Loading States** 🟢 UX MEJORADA

```javascript
// Componente reutilizable
const LoadingButton = ({ loading, children, ...props }) => (
  <button disabled={loading} {...props}>
    {loading ? (
      <>
        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Cargando...
      </>
    ) : (
      children
    )}
  </button>
);

// Uso
const [loading, setLoading] = useState(false);

const handleClick = async () => {
  setLoading(true);
  try {
    await api.post('/api/productos', productData);
    addNotification('Producto creado', 'success');
  } finally {
    setLoading(false);
  }
};

<LoadingButton loading={loading} onClick={handleClick}>
  Crear Producto
</LoadingButton>
```

---

### 5. **Configurar Application Properties para Demo Local** 🔵 NECESARIO

**`Backend/src/main/resources/application-dev.properties` (CREAR/MEJORAR):**

```properties
# --- DESARROLLO LOCAL ---
spring.application.name=ecommerce-local

# Base de Datos (H2 en memoria)
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# JPA / Hibernate
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Servidor
server.port=8080
server.servlet.context-path=/

# JWT
jwt.secret.key=demo-secret-key-change-in-production-12345678901234567890

# Multipart
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# Logging
logging.level.root=INFO
logging.level.back.ecommerce=DEBUG
logging.level.org.springframework.security=DEBUG

# CORS (para frontend local)
spring.web.cors.allowed-origins=http://localhost:5173,http://localhost:3000
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,PATCH,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true

# Integraciones (dummy para demo)
cloudinary.cloud_name=${CLOUDINARY_CLOUD_NAME:demo}
cloudinary.api_key=${CLOUDINARY_API_KEY:demo}
cloudinary.api_secret=${CLOUDINARY_API_SECRET:demo}
mp.access.token=${MP_ACCESS_TOKEN:demo}
resend.api.key=${RESEND_API_KEY:demo}
```

**Lanzar con perfil dev:**

```bash
cd Backend
./mvnw spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
```

---

### 6. **Insertar Datos de Demo en H2** 🔵 PRESENTACIÓN IMPACTANTE

**`Backend/src/main/resources/data.sql` (MEJORAR):**

```sql
-- Usuarios
INSERT INTO usuarios (dni, email, nombre, apellido, password_hash) VALUES
(12345678, 'demo@example.com', 'Juan', 'Pérez', '$2a$10$...');  -- contraseña: demo123
(87654321, 'admin@example.com', 'Admin', 'User', '$2a$10$...');

-- Tiendas
INSERT INTO tiendas (nombre_url, nombre_fantasia, descripcion, vendedor_dni) VALUES
('ropa-premium', 'Ropa Premium', 'Tienda de ropa de alta calidad', 12345678),
('tech-store', 'Tech Store', 'Electrónica y gadgets', 87654321);

-- Categorías
INSERT INTO categorias (nombre) VALUES
('Ropa'), ('Electrónica'), ('Accesorios');

-- Productos
INSERT INTO productos (nombre, descripcion, precio, stock, tienda_id, categoria_id) VALUES
('Camiseta Premium', 'Camiseta 100% algodón', 1999.00, 50, 1, 1),
('Pantalón Denim', 'Pantalón denim azul', 2999.00, 30, 1, 1),
('Laptop', 'Laptop 16GB RAM', 50000.00, 5, 2, 2),
('Auriculares', 'Auriculares Bluetooth', 3999.00, 20, 2, 3);
```

---

### 7. **Mejorar Swagger UI para Demo** 🟢 PROFESIONAL

**Backend `pom.xml` (agregar si no está):**

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.5.0</version>
</dependency>
```

**Acceso:** `http://localhost:8080/swagger-ui.html`

**Mejorar con anotaciones:**

```java
@RestController
@RequestMapping("/api/productos")
@Tag(name = "Productos", description = "Gestión de productos del e-commerce")
public class ProductosController {

    @GetMapping
    @Operation(summary = "Listar productos", 
               description = "Obtiene todos los productos de una tienda")
    @ApiResponse(responseCode = "200", description = "Lista de productos",
                 content = @Content(mediaType = "application/json",
                                   schema = @Schema(implementation = ProductosResponse.class)))
    public List<ProductosResponse> listar(@PathVariable String nombreTienda) {
        // ...
    }
}
```

---

### 8. **Crear Script de Inicio Rápido** 🟢 UX

**`run-local.sh` (macOS/Linux):**

```bash
#!/bin/bash

echo "🚀 Iniciando Ecommerce en LOCAL..."

# Backend
echo "📦 Iniciando Backend..."
cd Backend
./mvnw spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev" &
BACKEND_PID=$!

sleep 5

# Frontend
echo "⚛️  Iniciando Frontend..."
cd ../Frontend
npm run dev &
FRONTEND_PID=$!

echo "✅ Servicios iniciados:"
echo "   Backend:  http://localhost:8080"
echo "   Frontend: http://localhost:5173"
echo "   Swagger:  http://localhost:8080/swagger-ui.html"
echo "   H2 DB:    http://localhost:8080/h2-console"
echo ""
echo "Presiona Ctrl+C para detener"

wait
```

**`run-local.bat` (Windows PowerShell):**

```batch
@echo off
echo 🚀 Iniciando Ecommerce en LOCAL...

echo 📦 Iniciando Backend...
cd Backend
start cmd /k "mvnw spring-boot:run -Dspring-boot.run.arguments=^"--spring.profiles.active=dev^""

timeout /t 5

echo ⚛️ Iniciando Frontend...
cd ..\Frontend
start cmd /k "npm run dev"

echo.
echo ✅ Servicios iniciados:
echo    Backend:  http://localhost:8080
echo    Frontend: http://localhost:5173
echo    Swagger:  http://localhost:8080/swagger-ui.html
echo    H2 DB:    http://localhost:8080/h2-console
```

---

### 9. **Checklist de Presentación Local** ✅

```markdown
## Pre-Demo Checklist

- [ ] Backend compilado sin errores: `./mvnw clean package -DskipTests=true`
- [ ] Frontend build funciona: `npm run build`
- [ ] H2 con datos de demo (`data.sql` insertado)
- [ ] JWT funcionando (login/registro sin errores)
- [ ] CORS configurado (frontend puede llamar backend)
- [ ] Mensajes de error visuales funcionando
- [ ] Formularios validados
- [ ] Swagger UI accesible en /swagger-ui.html
- [ ] Prueba Producto → Carrito → Pedido (flujo completo)
- [ ] MercadoPago webhook simulado (o mostrar URL)
- [ ] Imágenes de Cloudinary cargadas (o usar URLs placeholder)
```

---

### 10. **Comandos Útiles para Demo** 🎯

```bash
# Iniciar todo
./run-local.sh  (o run-local.bat en Windows)

# O manual:

# Terminal 1 - Backend
cd Backend
./mvnw spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"

# Terminal 2 - Frontend
cd Frontend
npm run dev

# Terminal 3 - Opcional: H2 Console
# Acceder a http://localhost:8080/h2-console
# URL: jdbc:h2:mem:testdb
# Usuario: sa
# Password: (vacío)
```

---

## 🎬 Flujo de Demo Recomendado

1. **Mostrar Swagger UI** → Explicar endpoints
2. **Frontend Landing** → Mostrar UI profesional
3. **Registro usuario** → Crear cuenta demo
4. **Navegar productos** → Buscar, filtrar por categoría
5. **Agregar carrito** → Mostrar actualización en tiempo real
6. **Crear pedido** → Explicar flujo
7. **H2 Console** → Mostrar datos guardados en BD
8. **Código fuente** → Explicar arquitectura

---

## ⏱️ Tiempo estimado para implementar TODO

- **Autenticación mejorada:** 30 min
- **UI/Notificaciones:** 20 min
- **Validaciones:** 20 min
- **Data local:** 10 min
- **Scripts:** 10 min
- **Testing flujo:** 10 min

**Total: ~100 minutos (1.5-2 horas)**

---

*Guía compilada para presentación local profesional - 02/12/2025*
