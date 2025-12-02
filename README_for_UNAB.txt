Ecommerce_Unab - Documentación completa (Formato .txt)

Proyecto: Ecommerce_Unab
Trabajo final - Tecnicatura en Programación
Universidad Nacional Guillermo Brown
Autor / Owner del repo: Silvina1979
Fecha: 02/12/2025

---
Índice
1. Resumen ejecutivo
2. Tecnologías y versiones
3. Estructura del repositorio
4. Requisitos previos
5. Instalación y ejecución (entorno local)
   5.1 Backend (Spring Boot)
   5.2 Frontend (React + Vite)
6. Variables de entorno y configuración
7. Base de datos y datos iniciales
8. Endpoints principales y uso (resumen)
9. Arquitectura y flujo de información
10. Pruebas, lint y calidad
11. Docker y despliegue básico
12. Migración y notas sobre actualización a Spring Boot 3.5.x
13. Flujo de contribución (git, ramas, PR)
14. Problemas conocidos y riesgos
15. Licencia y créditos
16. Anexos: rutas importantes y comandos útiles

---
1. Resumen ejecutivo
Este proyecto es una aplicación de comercio electrónico que incluye un backend desarrollado en Java con Spring Boot y un frontend en React usando Vite. Implementa gestión de productos, carrito de compras, pedidos, autenticación con JWT, integración con MercadoPago para pagos, subida de imágenes con Cloudinary y envío de correos (Resend / spring-mail).

2. Tecnologías y versiones (detectadas)
- Backend: Java 21 (JDK 21.0.8 detectado)
- Spring Boot: actualmente 3.3.5 (parent en `Backend/pom.xml`)
- Build: Maven (Maven Wrapper `mvnw` disponible)
- Frontend: React 19, Vite (vite 7.x)
- Otras: H2 (runtime), MySQL (opcional), Lombok, springdoc-openapi, jjwt, Cloudinary, MercadoPago SDK

3. Estructura del repositorio
- `/Backend` — Proyecto Java Spring Boot
  - `pom.xml` — gestión de dependencias
  - `mvnw`, `mvnw.cmd` — Maven Wrapper
  - `src/main/java/back/ecommerce` — controladores, servicios, repositorios, modelos
  - `src/main/resources` — `application*.properties`, `data.sql`
  - `Dockerfile` — Dockerfile para backend
  - `.github/java-upgrade/.../plan.md` — plan de upgrade automático (si fue generado)
- `/Frontend` — Proyecto React + Vite
  - `package.json`, `package-lock.json`
  - `src/` — componentes, páginas, estilos
- `README_for_UNAB.txt` — este documento (edítalo según necesites)

4. Requisitos previos (instalar antes de ejecutar)
- Java JDK 21 (instalar JDK 21 y configurar `JAVA_HOME`)
- Maven 3.8+ (o usar `./mvnw` incluido)
- Node.js 18+ y npm (para el frontend)
- Git
- Opcional: Docker para contenerización, cuenta Cloudinary, clave MercadoPago y clave Resend para funcionalidades en producción

5. Instalación y ejecución (entorno local)
NOTA: los siguientes comandos están pensados para PowerShell (Windows). Ajústalos para macOS/Linux (bash/zsh) si corresponde.

5.1 Backend
1) Abrir PowerShell en el directorio `Backend`:
   cd 'C:\Users\silvi\Downloads\Ecommerce_Unab\Backend'

2) Verificar Java y Maven:
   java -version
   mvn -v

3) Compilar (sin tests para validación rápida):
   .\mvnw -B -DskipTests=true package

4) Ejecutar la aplicación:
   - Con Maven (modo desarrollador):
     .\mvnw spring-boot:run
   - O ejecutando el jar generado:
     java -jar target\ecommerce-0.0.1-SNAPSHOT.jar

5) Notas de perfiles:
   - `src/main/resources` contiene `application.properties`, `application-dev.properties` y `application-prod.properties`.
   - Cambia `spring.profiles.active` a `dev` o `prod` según necesites.

5.2 Frontend
1) Abrir PowerShell en `Frontend`:
   cd 'C:\Users\silvi\Downloads\Ecommerce_Unab\Frontend'

2) Verificar Node y npm:
   node -v
   npm -v

3) Instalar dependencias (primera vez):
   npm install

4) Ejecutar servidor de desarrollo (Vite):
   npm run dev
   - Vite indicará la URL local (por ej. http://localhost:5173)

5) Construcción de producción:
   npm run build
   npm run preview  # para previsualizar el build

6. Variables de entorno y configuración
No subir claves en texto claro al repo. Usa `.env` en el frontend para variables de Vite, y variables de entorno o `application-*.properties` para el backend.

Variables recomendadas (ejemplos):
- Backend:
  - `SPRING_DATASOURCE_URL` = jdbc:mysql://host:3306/db
  - `SPRING_DATASOURCE_USERNAME`
  - `SPRING_DATASOURCE_PASSWORD`
  - `SPRING_PROFILES_ACTIVE` = dev|prod
  - `JWT_SECRET` = token secreto para JWT
  - `CLOUDINARY_URL` o `CLOUDINARY_*` = credenciales Cloudinary
  - `MERCADOPAGO_ACCESS_TOKEN`
  - `RESEND_API_KEY`
- Frontend (archivo `.env` o `.env.local`):
  - `VITE_API_URL=http://localhost:8080`

7. Base de datos y datos iniciales
- Para desarrollo el proyecto incluye `H2` en runtime y un `data.sql` con datos iniciales en `src/main/resources`.
- Para producción configure MySQL y actualice `application-prod.properties` con las credenciales y URL correctas.
- Migrations (si las agregas): considera integrar Flyway o Liquibase para migraciones futuras.

8. Endpoints detallados (completo)
A continuación se incluye la documentación completa de endpoints extraída del backend. Muchas rutas requieren autenticación JWT: enviar header `Authorization: Bearer <token>` excepto las rutas públicas documentadas.

Rutas públicas (según `SecurityConfiguration`):
- `/api/auth/**` (registro/login/verify)
- `/api/pagos/webhook`
- GET `/api/tiendas/**` (obtener tiendas)
- Swagger/OpenAPI paths

Para subir archivos use `Content-Type: multipart/form-data` y combine partes: un campo JSON (nombre: `producto` o `tienda`) y opcionalmente `file`.

1) Autenticación
- POST /api/auth/register
  - Descripción: registrar usuario nuevo.
  - Autorización: pública
  - Body (JSON):
    {
      "dni": 12345678,
      "nombre": "Nombre",
      "apellido": "Apellido",
      "email": "usuario@example.com",
      "password": "secreto123"
    }
  - Respuesta (200 OK):
    {
      "token": "<jwt-token>"
    }

- POST /api/auth/login
  - Descripción: iniciar sesión con email y password.
  - Autorización: pública
  - Body (JSON):
    {
      "email": "usuario@example.com",
      "password": "secreto123"
    }
  - Respuesta (200 OK):
    {
      "token": "<jwt-token>"
    }

- GET /api/auth/verify?code={code}
  - Descripción: verificar cuenta con código.
  - Autorización: pública
  - Parámetros: query `code` (string)
  - Respuesta (200 OK): mensaje de confirmación (string).

2) Usuarios
Base: /api/usuarios
(Autenticación requerida por defecto)

- GET /api/usuarios
  - Descripción: obtener todos los usuarios
  - Respuesta (200): Array de UsuariosResponse
  - UsuariosResponse:
    {
      "dni": 12345678,
      "email": "a@b.com",
      "nombre": "Nombre",
      "apellido": "Apellido"
    }

- GET /api/usuarios/{dni}
  - Descripción: obtener usuario por DNI
  - Path: `dni` (Long)
  - Respuesta (200): UsuariosResponse

- PATCH /api/usuarios/{dni}
  - Descripción: actualizar usuario (body parcial con UsuariosRequest)
  - Body (JSON): UsuariosRequest (leer campos obligatorios en DTO)
  - Respuesta (200): UsuariosResponse

- DELETE /api/usuarios/{dni}
  - Descripción: eliminar usuario
  - Respuesta: 204 No Content

3) Tiendas
Base: /api/tiendas
- POST /api/tiendas (multipart/form-data)
  - Descripción: crear tienda (envía JSON como campo `tienda` y opcional `file` para logo)
  - Consumir: multipart/form-data
  - Partes:
    - `tienda`: JSON string con TiendaRequest
      Ejemplo de TiendaRequest:
      {
        "nombreUrl": "mi-tienda",
        "nombreFantasia": "Mi Tienda",
        "descripcion": "Descripción...",
        "vendedorDni": 12345678
      }
    - `file`: (opcional) archivo imagen
  - Respuesta: 201 Created con TiendaResponse
    TiendaResponse ejemplo:
    {
      "id": 1,
      "nombreUrl": "mi-tienda",
      "nombreFantasia": "Mi Tienda",
      "logo": "https://.../logo.jpg",
      "descripcion": "...",
      "vendedorDni": 12345678,
      "vendedorNombre": "Nombre Vendedor"
    }

- GET /api/tiendas/{nombreUrl}
  - Descripción: obtener tienda por nombreUrl (pública)
  - Respuesta: TiendaResponse

- PATCH /api/tiendas/{nombreUrl} (multipart/form-data)
  - Descripción: actualizar tienda. Partes similares a POST (campo `tienda` opcional)
  - Respuesta: 200 OK con TiendaResponse

4) Productos
Base: /api/tiendas/{nombreTienda}/productos
(Autenticación requerida por defecto)

- GET /api/tiendas/{nombreTienda}/productos?sort={sort}
  - Descripción: listar productos de la tienda, opcional `sort`
  - Respuesta: Array de ProductosResponse
  - ProductosResponse ejemplo:
    {
      "id": 10,
      "categoriaId": 2,
      "nombre": "Camiseta",
      "descripcion": "Alguna descripción",
      "precio": 1999.0,
      "stock": 10,
      "categoriaNombre": "Ropa",
      "imagen": "https://.../img.jpg"
    }

- POST /api/tiendas/{nombreTienda}/productos  (multipart/form-data)
  - Descripción: crear producto con JSON en parte `producto` y opcional `file` (imagen)
  - Partes:
    - `producto`: JSON string con ProductosRequest
      Ejemplo ProductosRequest:
      {
        "categoriaId": 2,
        "nombre": "Camiseta",
        "descripcion": "Descripción corta",
        "precio": 1999.0,
        "stock": 20
      }
    - `file`: imagen opcional
  - Respuesta: 201 Created con ProductosResponse

- GET /api/tiendas/{nombreTienda}/productos/buscar?q={termino}
  - Descripción: buscar por nombre (query `q`)
  - Respuesta: lista de ProductosResponse

- GET /api/tiendas/{nombreTienda}/productos/categoria/{categoriaId}
  - Descripción: productos por categoría
  - Respuesta: lista de ProductosResponse

- GET /api/tiendas/{nombreTienda}/productos/{id}
  - Descripción: producto por id
  - Respuesta: ProductosResponse

- PATCH /api/tiendas/{nombreTienda}/productos/{id}
  - Descripción: actualizar producto (JSON ProductosRequest)
  - Body ejemplo:
    { "nombre": "Nueva cami", "precio": 2100.0 }
  - Respuesta: 200 OK con ProductosResponse

- DELETE /api/tiendas/{nombreTienda}/productos/{id}
  - Descripción: eliminar producto
  - Respuesta: 204 No Content

5) Storage / Cloudinary
Base: /api/storage
- POST /api/storage/upload (multipart/form-data)
  - Descripción: subir imagen, recibe `file` form-data
  - Respuesta (200): { "url": "https://res.cloudinary.com/.../image.jpg" }
  - Autenticación: Requiere autenticación (según configuración de seguridad)

6) Carrito
Base: /api/tiendas/{nombreTienda}/carrito
(Autenticación requerida)

- POST /api/tiendas/{nombreTienda}/carrito/agregar
  - Descripción: agregar producto al carrito
  - Body (CarritoRequest):
    {
      "usuarioDni": 12345678,
      "productoId": 10,
      "cantidad": 2
    }
  - Respuesta: CarritoResponse ejemplo:
    {
      "idItem": 55,
      "productoId": 10,
      "nombreProducto": "Camiseta",
      "imagenProducto": "...",
      "precioUnitario": 1999.0,
      "cantidad": 2,
      "subtotal": 3998.0,
      "tiendaId": 3,
      "nombreTienda": "mi-tienda"
    }

- GET /api/tiendas/{nombreTienda}/carrito/{usuarioDni}
  - Descripción: ver carrito del usuario (lista de CarritoResponse)

- DELETE /api/tiendas/{nombreTienda}/carrito/item/{idItem}
  - Descripción: eliminar item del carrito por idItem
  - Respuesta: 204 No Content

- DELETE /api/tiendas/{nombreTienda}/carrito/vaciar/{usuarioDni}
  - Descripción: vaciar carrito del usuario
  - Respuesta: 204 No Content

7) Pedidos
Base: /api/tiendas/{nombreTienda}/pedidos
(Autenticación requerida)

- POST /api/tiendas/{nombreTienda}/pedidos
  - Descripción: crear pedido desde carrito
  - Body (PedidosRequest):
    {
      "estado": "PENDIENTE",
      "total": 3998.0,
      "items": [
        {
          "cantidad": 2,
          "precioUnitario": 1999.0,
          "nombreProducto": "Camiseta",
        

9. Arquitectura y flujo de información
- Frontend (React) consume la API REST del backend usando `axios`.
- Backend expone endpoints REST y usa Spring Data JPA para persistencia.
- Seguridad: Spring Security + JWT (filter que valida token en `Authorization: Bearer <token>`).
- Integraciones externas:
  - MercadoPago para pagos
  - Cloudinary para almacenamiento de imágenes
  - Resend o `spring-boot-starter-mail` para envíos de correo

10. Pruebas, lint y calidad
- Backend (Maven):
  .\mvnw -B -DskipTests=false test
  - Informes en `target/surefire-reports/`.
- Frontend:
  npm test  # usa vitest si está configurado
  npm run lint

11. Docker y despliegue básico
- Backend Dockerfile existe en `Backend/Dockerfile`.
  - Construir imagen:
    docker build -t ecommerce-backend ./Backend
  - Ejecutar contenedor (ejemplo):
    docker run -e SPRING_PROFILES_ACTIVE=prod -p 8080:8080 ecommerce-backend
- Frontend: puedes servir el build en un servidor estático (NGINX) o usar servicios como Netlify, Vercel o servir desde un contenedor.

12. Migración y notas sobre actualización a Spring Boot 3.5.x
- Se generó un plan de upgrade automático bajo `.github/java-upgrade/20251202230630/plan.md` con la sesión ID: 20251202230630.
- Recomendación de estrategia (milestone-based):
  1. Migrar primero a Spring Boot 3.4.x
  2. Luego a Spring Boot 3.5.x
  3. Usar OpenRewrite para aplicar recetas de cambio donde sea posible
  4. Iterar: compilar, arreglar errores, ejecutar tests, repetir
- Riesgos principales:
  - Compatibilidad con paquetes `javax.*` vs `jakarta.*`
  - Dependencias de terceros (actualizar versiones de `springdoc-openapi`, `jjwt`, `cloudinary`, `resend-java`, etc.)
  - Cambios en APIs de Spring Security / configuraciones por defecto

13. Flujo de contribución
1. Crear rama desde `develop`:
   git checkout develop
   git pull origin develop
   git checkout -b feat/descripcion
2. Hacer cambios, pruebas locales y commits pequeños y descriptivos.
3. Push y abrir Pull Request contra `develop` con descripción y pasos para probar.

14. Problemas conocidos y riesgos
- Algunas dependencias pueden necesitar actualización antes de migrar a Spring Boot 3.5.
- Variables sensibles no deben subirse al repo.
- Tests de integración que dependen de servicios externos (MercadoPago, Resend) pueden fallar en CI; mockear en tests.

15. Licencia y créditos
- Añade una licencia conforme a tus requisitos (por ejemplo MIT). Si deseas que lo agregue, puedo crear un archivo `LICENSE`.
- Autores: Lucca Perez Veltri, Nicolas Gigena y Silvina Souza Faviero

16. Anexos: rutas importantes y comandos útiles
Rutas:
- `Backend/pom.xml`
- `Backend/src/main/java/back/ecommerce` (código backend)
- `Frontend/package.json` (scripts frontend)
- `Backend/Dockerfile`
- `.github/java-upgrade/20251202230630/plan.md` (plan de migración)

Comandos más usados:
- Backend:
  .\mvnw -B -DskipTests=true package
  .\mvnw spring-boot:run
  .\mvnw -B -DskipTests=false test
- Frontend:
  npm install
  npm run dev
  npm run build
  npm run preview
- Docker:
  docker build -t ecommerce-backend ./Backend
  docker run -e SPRING_PROFILES_ACTIVE=prod -p 8080:8080 ecommerce-backend

