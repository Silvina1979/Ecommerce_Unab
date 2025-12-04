# Ecommerce UNAB — Full Stack Application

**Aplicación e-commerce completa** con frontend React + backend Spring Boot, diseñada para permitir que vendedores creen tiendas y productos, y compradores realicen pedidos con integración de pagos.

> **Proyecto académico** — Práctica Profesional Supervisada (UNAB)  
> **Estado:** Funcional para demo local; preparado para evolución a producción  
> **Última actualización:** Diciembre 2025

---

## 📋 Contenido

1. [Descripción general](#descripción-general)
2. [Tecnologías](#tecnologías)
3. [Requisitos previos](#requisitos-previos)
4. [Instalación y setup](#instalación-y-setup)
5. [Ejecución](#ejecución)
6. [Estructura del proyecto](#estructura-del-proyecto)
7. [Funcionalidades principales](#funcionalidades-principales)
8. [Endpoints de API](#endpoints-de-api)
9. [Configuración de entorno](#configuración-de-entorno)
10. [Testing](#testing)
11. [Roadmap y mejoras futuras](#roadmap-y-mejoras-futuras)
12. [Contribución y preguntas](#contribución-y-preguntas)

---

## 📌 Descripción general

**Ecommerce UNAB** es una plataforma que simula un marketplace real donde:

- **Vendedores** pueden crear tiendas, subir productos con imágenes, gestionar categorías y ver pedidos.
- **Compradores** navegan tiendas, buscan productos, agregan items al carrito y generan órdenes de compra.
- **Sistema de pagos** integrado con **MercadoPago** (modo sandbox en desarrollo).
- **Notificaciones** por email (con **Resend**) y visuales en tiempo real.
- **Almacenamiento de imágenes** en la nube (con **Cloudinary**).

---

## 🛠️ Tecnologías

### Backend
- **Java 21** (JDK)
- **Spring Boot 3.3.5** — framework principal
- **Spring Security + JWT** — autenticación y autorización
- **Spring Data JPA** — persistencia de datos
- **Maven** — gestor de dependencias y build
- **H2** (desarrollo) / **MySQL** (producción)
- **springdoc-openapi** — documentación de API (Swagger)
- **Docker** — containerización multi-stage

**Dependencias clave:**
- `jjwt:0.11.5` — manejo de JWT
- `spring-boot-starter-web` — REST API
- `spring-boot-starter-data-jpa` — ORM
- `mysql-connector-java` — soporte MySQL
- `h2` — base de datos en memoria (dev)

### Frontend
- **React 19** — UI framework
- **Vite** — herramienta de build y dev server
- **Axios** — cliente HTTP
- **React Router v7** — enrutamiento
- **Bootstrap 5** — diseño responsivo
- **Context API + hooks** — gestión de estado

**Dependencias clave:**
- `react-router-dom` — navegación
- `axios` — llamadas a API
- `bootstrap` — componentes CSS

### DevOps & Infra
- **Docker** — containerización
- **Dockerfile multi-stage** — optimización de imágenes
- **GitHub** — versionado y repositorio
- **Git workflows** (branches: `develop`, `main`)

### Integraciones externas
- **MercadoPago API** — procesamiento de pagos
- **Cloudinary API** — almacenamiento y CDN de imágenes
- **Resend API** — envío de emails

---

## 📦 Requisitos previos

Asegúrate de tener instalado en tu máquina:

- **JDK 21+** ([descargar](https://www.oracle.com/java/technologies/downloads/))
- **Maven 3.9+** (incluido en el repo: `mvnw` / `mvnw.cmd`)
- **Node.js 18+** ([descargar](https://nodejs.org/))
- **npm** (incluido con Node.js)
- **Git** ([descargar](https://git-scm.com/))
- (Opcional) **Docker** ([descargar](https://www.docker.com/))

---

## 🚀 Instalación y setup

### 1. Clonar el repositorio

```bash
git clone https://github.com/Silvina1979/Ecommerce_Unab.git
cd Ecommerce_Unab
```

### 2. Backend — Spring Boot

#### a) Compilar el proyecto

```powershell
cd Backend
.\mvnw.cmd clean package -DskipTests
```

> Si estás en Linux/macOS, usa `./mvnw` en lugar de `.\mvnw.cmd`.

#### b) Configurar variables de entorno

Copia `.env.example` a `.env` y llena los valores según tu entorno:

```powershell
copy .env.example .env
```

**Variables de entorno necesarias (dev):**

```env
# Desarrollo
SPRING_PROFILES_ACTIVE=dev
SPRING_DATASOURCE_URL=jdbc:h2:mem:testdb
SPRING_DATASOURCE_USERNAME=sa
SPRING_DATASOURCE_PASSWORD=

# JWT
JWT_SECRET_KEY=tu_clave_secreta_aqui_minimo_256_bits

# MercadoPago (opcional para demo local)
MP_ACCESS_TOKEN=tu_token_mercadopago_aqui

# Cloudinary (opcional para subir imágenes)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Resend (opcional para envío de emails)
RESEND_API_KEY=tu_resend_key
```

Para **producción**, usa `application-prod.properties` con variables de entorno para MySQL y credenciales externas.

### 3. Frontend — React + Vite

#### a) Instalar dependencias

```powershell
cd Frontend
npm install
```

#### b) Configurar archivo `.env.local`

```powershell
copy .env.example .env.local
```

**Variables necesarias:**

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name  # opcional
```

---

## ▶️ Ejecución

### Opción 1: Ejecutar en desarrollo (sin Docker)

#### Terminal 1: Backend

```powershell
cd Backend
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev
```

El backend estará disponible en: **http://localhost:8080**

- Swagger UI (API docs): http://localhost:8080/swagger-ui.html
- H2 Console (base de datos): http://localhost:8080/h2-console (user: `sa`, password: vacía)

#### Terminal 2: Frontend

```powershell
cd Frontend
npm run dev
```

El frontend estará disponible en: **http://localhost:5173** (o la que indique Vite)

### Opción 2: Ejecutar con Docker

#### Buildear y ejecutar backend en contenedor

```bash
cd Backend
docker build -t ecommerce-backend .
docker run -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=dev \
  -e JWT_SECRET_KEY=tu_clave_secreta \
  ecommerce-backend
```

#### Ejecutar frontend en contenedor (después de build)

```bash
cd Frontend
npm run build
docker build -t ecommerce-frontend .
docker run -p 5173:5173 ecommerce-frontend
```

### Opción 3: Script de inicio unificado (PowerShell)

Si quieres iniciar backend y frontend en paralelo (Windows):

```powershell
# run-local.ps1 (en la raíz del proyecto)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd Backend; .\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev"
Start-Sleep -Seconds 10
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd Frontend; npm run dev"
```

---

## 📁 Estructura del proyecto

```
Ecommerce_Unab/
├── Backend/                                    # Spring Boot application
│   ├── mvnw / mvnw.cmd                         # Maven Wrapper
│   ├── pom.xml                                 # Dependencias y build config
│   ├── Dockerfile                              # Containerización multi-stage
│   ├── .env.example                            # Template de variables de entorno
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/back/ecommerce/
│   │   │   │   ├── controllers/                # REST endpoints
│   │   │   │   ├── services/                   # Lógica de negocio
│   │   │   │   ├── repositories/               # Acceso a datos (JPA)
│   │   │   │   ├── models/entities/            # Entidades JPA
│   │   │   │   ├── dto/                        # Data Transfer Objects
│   │   │   │   ├── config/                     # Configuraciones (Security, CORS, etc)
│   │   │   │   └── exception/                  # Manejo de errores
│   │   │   └── resources/
│   │   │       ├── application.properties      # Config predeterminada (dev)
│   │   │       ├── application-dev.properties  # Config desarrollo
│   │   │       ├── application-prod.properties # Config producción
│   │   │       └── data.sql                    # Datos iniciales (H2)
│   │   └── test/
│   │       └── java/back/ecommerce/            # Tests unitarios
│   ├── test_prod.py                            # Script Python de prueba de integración
│   └── target/                                 # Artefactos de build (no versionar)
│
├── Frontend/                                   # React + Vite application
│   ├── package.json                            # Dependencias npm
│   ├── vite.config.js                          # Configuración Vite
│   ├── eslint.config.js                        # Linting
│   ├── .env.example                            # Template de variables de entorno
│   ├── public/                                 # Archivos estáticos públicos
│   ├── src/
│   │   ├── main.jsx                            # Entry point
│   │   ├── App.jsx                             # Componente raíz
│   │   ├── landing/                            # Páginas públicas (Login, register)
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   └── styles/
│   │   ├── tienda/                             # Tienda (comprador)
│   │   │   ├── pages/                          # Catálogo, carrito, pedidos
│   │   │   ├── components/                     # Componentes reutilizables
│   │   │   ├── services/                       # Llamadas a API
│   │   │   ├── contexts/                       # Estado global (Auth, Tienda)
│   │   │   └── styles/
│   │   ├── admin/                              # Panel admin (vendedor)
│   │   │   ├── pages/                          # Gestión de productos, categorías, pedidos
│   │   │   ├── layouts/
│   │   │   └── styles/
│   │   ├── components/                         # Componentes globales
│   │   ├── contexts/                           # Contextos globales (Notificaciones)
│   │   └── utils/                              # Funciones utilitarias
│   ├── dist/                                   # Build de producción (no versionar)
│   └── node_modules/                           # Dependencias (no versionar)
│
├── .github/                                    # Configuraciones de GitHub
├── .gitignore                                  # Archivos a ignorar en Git
├── README.md                                   # Este archivo
├── README_FULL.md                              # Documentación extendida
├── API_ENDPOINTS_FOR_UNAB.txt                  # Listado de endpoints con ejemplos
├── CURL_EXAMPLES.md                            # Ejemplos curl para testing
├── PROJECT_EVALUATION.md                       # Evaluación y recomendaciones
├── PRESENTATION_SLIDES.md                      # Slides para presentación
└── ANALISIS_MEJORAS_IMPLEMENTADAS.md          # Análisis de estado del código
```

---

## ✨ Funcionalidades principales

### 🔐 Autenticación y autorización
- Registro de usuarios (vendedores y compradores)
- Login con JWT
- Perfiles: VENDEDOR, COMPRADOR, ADMIN
- Recuperación de usuario desde token (localStorage)

### 🏪 Gestión de tiendas
- Crear tienda (vendedor)
- Actualizar datos de tienda
- Listar tiendas públicas
- Acceso exclusivo para propietario

### 📦 Gestión de productos
- CRUD completo de productos (vendedor)
- Subida de imágenes a Cloudinary
- Categorización de productos
- Búsqueda y filtrado por categoría
- Stock y validaciones de disponibilidad

### 🛒 Carrito y pedidos
- Agregar/modificar items al carrito
- Persistencia de carrito en BD
- Crear pedido desde carrito
- Historial de pedidos por usuario y tienda
- Estados de pedido: Pendiente → Pagado → Entregado

### 💳 Pagos
- Integración con MercadoPago
- Generación de link de pago
- Webhook para actualizar estado de pedido
- Modo sandbox para desarrollo

### 📧 Notificaciones
- Sistema de notificaciones visuales (toast) en frontend
- Envío de emails con Resend (configuración en backend)
- Confirmación de pedidos

### 📊 Admin / Dashboard
- Panel para vendedores
- Gestión de categorías y productos
- Visualización de pedidos
- Estadísticas básicas

---

## 🔌 Endpoints de API

La API está documentada automáticamente por **springdoc-openapi**. Una vez que el backend esté en ejecución, abrí la **Swagger UI** para ver el listado completo de endpoints, parámetros y esquemas:

- Swagger UI: `http://localhost:8080/swagger-ui.html`

Si preferís ejemplos curl exportables o un listado en texto, puedo generarlos desde los controladores y agregarlos al repositorio bajo petición.

### Ejemplos rápidos (mínimos)

**Registro:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"dni":"12345678","nombre":"Juan","email":"juan@test.com","password":"123456"}'
```

**Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"juan@test.com","password":"123456"}'
```

**Listar productos de una tienda:**
```bash
curl -X GET http://localhost:8080/api/tiendas/tech-store/productos \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

---

## 🔧 Configuración de entorno

### Desarrollo (H2 en memoria)

**Backend:** `application-dev.properties`

```properties
spring.profiles.active=dev
spring.datasource.url=jdbc:h2:mem:testdb
spring.jpa.hibernate.ddl-auto=create-drop
spring.h2.console.enabled=true
```

### Producción (MySQL)

**Backend:** `application-prod.properties`

```properties
spring.profiles.active=prod
spring.datasource.url=${JDBC_DATABASE_URL}
spring.datasource.username=${JDBC_DATABASE_USERNAME}
spring.datasource.password=${JDBC_DATABASE_PASSWORD}
spring.jpa.hibernate.ddl-auto=validate  # ⚠️ Cambiar a validate o usar migraciones
```

---

## 🧪 Testing

### Tests backend (unitarios)

```powershell
cd Backend
.\mvnw.cmd test
```

Tests disponibles: `Backend/src/test/java/back/ecommerce/`

### Script de integración (Python)

```powershell
cd Backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install requests
python test_prod.py
```

Este script automatiza un flujo completo: crear usuario, tienda, productos, carrito y pedido.

### Lint frontend

```powershell
cd Frontend
npm run lint
```

---

## 🚧 Roadmap y mejoras futuras

### ✅ Completado
- [x] Estructura base backend/frontend
- [x] Autenticación JWT
- [x] CRUD tiendas, productos, carrito, pedidos
- [x] Integración MercadoPago
- [x] Subida de imágenes a Cloudinary
- [x] Validaciones frontend
- [x] Sistema de notificaciones

### 🔄 En progreso / Pendiente (Prioridad alta)
- [ ] Migraciones DB con Flyway/Liquibase
- [ ] Cambiar `ddl-auto=update` a `validate` en producción
- [ ] Aumentar HikariCP pool size (actualmente 2, recomendado 20 en prod)
- [ ] Endpoint `GET /api/auth/me`
- [ ] Tests de integración con RestAssured
- [ ] Pipeline CI/CD (GitHub Actions)
- [ ] Paginación en endpoints `GET` grandes

### 💡 Nice to have (Prioridad media)
- [ ] Cache con Redis
- [ ] Optimización de queries (`@EntityGraph`)
- [ ] Refresh tokens JWT
- [ ] Rate limiting
- [ ] Swagger completo con todas las anotaciones
- [ ] Componente LoadingButton reutilizable
- [ ] Tests frontend con Vitest/React Testing Library
- [ ] Modo offline con Service Workers

---

## 🐛 Troubleshooting

| Problema | Solución |
|----------|----------|
| `Port 8080 already in use` | Cambiar puerto en `application.properties`: `server.port=8081` |
| `JWT_SECRET_KEY not set` | Llenar `.env` con un valor secreto de mínimo 256 bits |
| `Cloudinary upload fails` | Verificar credenciales en `application-prod.properties` o `.env` |
| `H2 Console no accessible` | Asegurar `spring.h2.console.enabled=true` en `application-dev.properties` |
| `npm install fails` | Borrar `node_modules/` y `package-lock.json`, luego correr `npm install` nuevamente |
| `Frontend cannot connect to backend` | Verificar que `VITE_API_BASE_URL` sea correcto (ej. `http://localhost:8080`) |

---


---

## 📄 Licencia

Proyecto académico sin licencia específica. Uso libre para propósitos educativos.

---

**¡Gracias por revisar el proyecto! 🚀**

