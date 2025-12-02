# Ecommerce_Unab

Trabajo final — Tecnicatura en Programación
Universidad Nacional Guillermo Brown

**Autor:** Silvina1979
**Fecha:** 02/12/2025

---
## Resumen
Aplicación de e-commerce educativa con backend en Java + Spring Boot y frontend en React + Vite. Funcionalidades clave: gestión de tiendas y productos, carrito, pedidos, autenticación con JWT, integración con MercadoPago, subida de imágenes a Cloudinary y envío de correos.

---
## Tecnologías
- Backend: Java 21, Spring Boot (parent actual: `3.3.5`), Maven (wrapper `mvnw`).
- Frontend: React 19, Vite, Bootstrap 5.
- Base de datos: H2 (desarrollo), MySQL (opcional en producción).
- SDKs / libs: MercadoPago, Cloudinary, Resend, jjwt, springdoc-openapi, Lombok.

---
## Estructura del repositorio (resumen)
- `Backend/` — código Java Spring Boot (controladores, servicios, repositorios, DTOs, properties, Dockerfile).
- `Frontend/` — código React + Vite (scripts: `dev`, `build`, `preview`).
- `README_for_UNAB.txt` — documentación completa en texto plano.
- `API_ENDPOINTS_FOR_UNAB.txt` — listado de endpoints y ejemplos (generado automáticamente).
- `.github/java-upgrade/.../plan.md` — plan de migración a Spring Boot 3.5 (si fue generado).

---
## Requisitos previos
- Java JDK 21
- Maven 3.8+ (o usar `./mvnw`)
- Node.js 18+ y npm
- Git
- Opcional: Docker, cuentas Cloudinary y MercadoPago, clave Resend para correos

---
## Instalación y ejecución (resumen rápido, PowerShell)
### Backend
```powershell
cd 'C:\Users\silvi\Downloads\Ecommerce_Unab\Backend'
# Comprobar Java y Maven
java -version
mvn -v
# Compilar (sin tests)
.\mvnw -B -DskipTests=true package
# Ejecutar
.\mvnw spring-boot:run
# o
java -jar target\ecommerce-0.0.1-SNAPSHOT.jar
```

### Frontend
```powershell
cd 'C:\Users\silvi\Downloads\Ecommerce_Unab\Frontend'
node -v
npm -v
npm install
npm run dev
# build
npm run build
npm run preview
```

---
## Variables de entorno recomendadas
- Backend:
  - `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`
  - `SPRING_PROFILES_ACTIVE=dev|prod`
  - `JWT_SECRET`
  - `CLOUDINARY_URL` o `CLOUDINARY_*`
  - `MERCADOPAGO_ACCESS_TOKEN`
  - `RESEND_API_KEY`
- Frontend:
  - `VITE_API_URL=http://localhost:8080`

> No subir claves al repositorio. Usar `.env` o secret manager.

---
## API — Resumen y ejemplos (extraído del backend)
A continuación se incluye la documentación de endpoints extraída del backend. Muchas rutas requieren autenticación JWT: enviar header `Authorization: Bearer <token>` salvo las rutas públicas.

**Rutas públicas (según `SecurityConfiguration`):**
- `/api/auth/**` (registro/login/verify)
- `/api/pagos/webhook`
- GET `/api/tiendas/**` (obtener tiendas)
- Swagger/OpenAPI paths

**Subida de archivos:** use `Content-Type: multipart/form-data` y combine partes: un campo JSON (nombre: `producto` o `tienda`) y opcionalmente `file`.

### Autenticación
- `POST /api/auth/register` — Registro de usuario
  - Body (JSON): `RegisterRequest` (dni, nombre, apellido, email, password)
  - Respuesta: `{ "token": "<jwt>" }`

- `POST /api/auth/login` — Login
  - Body (JSON): `AuthRequest` (email, password)
  - Respuesta: `{ "token": "<jwt>" }`

- `GET /api/auth/verify?code={code}` — Verificar cuenta

### Usuarios (protegido)
- `GET /api/usuarios` — Obtener todos
- `GET /api/usuarios/{dni}` — Obtener por DNI
- `PATCH /api/usuarios/{dni}` — Actualizar (UsuariosRequest)
- `DELETE /api/usuarios/{dni}` — Eliminar

### Tiendas
- `POST /api/tiendas` (multipart/form-data)
  - Partes: `tienda` (JSON string con `TiendaRequest`), `file` (logo opcional)
- `GET /api/tiendas/{nombreUrl}` — Obtener tienda (pública)
- `PATCH /api/tiendas/{nombreUrl}` (multipart/form-data) — Actualizar tienda

### Productos
Base: `/api/tiendas/{nombreTienda}/productos`
- `GET` — Listar (opcional `?sort=`)
- `POST` (multipart/form-data) — Crear (parte `producto` JSON, `file` opcional)
- `GET /buscar?q=` — Buscar por nombre
- `GET /categoria/{categoriaId}` — Filtrar por categoría
- `GET /{id}` — Obtener por id
- `PATCH /{id}` — Actualizar
- `DELETE /{id}` — Eliminar

### Carrito
Base: `/api/tiendas/{nombreTienda}/carrito`
- `POST /agregar` — Agregar al carrito (CarritoRequest)
- `GET /{usuarioDni}` — Ver carrito del usuario
- `DELETE /item/{idItem}` — Eliminar item
- `DELETE /vaciar/{usuarioDni}` — Vaciar carrito

### Pedidos
Base: `/api/tiendas/{nombreTienda}/pedidos`
- `POST` — Crear pedido (PedidosRequest)
- `GET` — Listar pedidos de la tienda
- `GET /usuario/{dni}` — Pedidos por usuario
- `GET /{id}` — Obtener pedido
- `PATCH /{id}` — Actualizar pedido
- `DELETE /{id}` — Eliminar pedido

### Pagos (MercadoPago)
Base: `/api/pagos`
- `POST /crear/{pedidoId}` — Genera link de pago (retorna `{ "url": "..." }`)
- `POST /webhook` — Endpoint para notificaciones (público)

> Para la documentación completa y ejemplos de request/response en texto plano descarga `API_ENDPOINTS_FOR_UNAB.txt` y `README_for_UNAB.txt`.

---
## Migración a Spring Boot 3.5 (nota)
- Se generó un plan de upgrade automático: sesión ID `20251202230630`.
- Plan guardado en: `.github/java-upgrade/20251202230630/plan.md`.
- Recomendación: migrar por hitos (3.4.x → 3.5.x), usar OpenRewrite, iterar compilación y tests.

---
## Tests y calidad
- Backend: `./mvnw -B -DskipTests=false test` (informes en `target/surefire-reports/`).
- Frontend: `npm test` (Vitest) y `npm run lint`.

---
## Docker (backend)
```powershell
cd Backend
docker build -t ecommerce-backend .
docker run -e SPRING_PROFILES_ACTIVE=prod -p 8080:8080 ecommerce-backend
```

---
## Contribución
1. `git checkout develop`
2. `git pull origin develop`
3. `git checkout -b feat/mi-cambio`
4. Hacer cambios, tests, commits.
5. `git push -u origin feat/mi-cambio` y abrir PR.

---
## Archivos importantes
- `Backend/pom.xml`
- `Backend/src/main/java/back/ecommerce/controllers` (controladores)
- `Backend/src/main/java/back/ecommerce/dtos` (DTOs)
- `Frontend/package.json`
- `Backend/Dockerfile`
- `API_ENDPOINTS_FOR_UNAB.txt`
- `README_for_UNAB.txt`

---
## Próximos pasos sugeridos
- Añadir ejemplos `curl` y/o colección Postman (puedo generarlos).
- Añadir captura de pantallas y diagramas para la entrega.
- Agregar `LICENSE` si corresponde.


