# Ejemplos CURL para Ecommerce_Unab API

Base URL: `http://localhost:8080`

> **Nota:** Reemplaza `{jwt-token}` con el token obtenido del login/register, y los valores de ejemplo con datos reales.

---

## Autenticación

### Registro
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "dni": 12345678,
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@example.com",
    "password": "Mi_Contraseña_123"
  }'
```
**Respuesta exitosa (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "Mi_Contraseña_123"
  }'
```
**Respuesta exitosa (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Verificar cuenta
```bash
curl -X GET "http://localhost:8080/api/auth/verify?code=abc123xyz"
```

---

## Usuarios (protegido — requiere token)

### Obtener todos los usuarios
```bash
curl -X GET http://localhost:8080/api/usuarios \
  -H "Authorization: Bearer {jwt-token}"
```

### Obtener usuario por DNI
```bash
curl -X GET http://localhost:8080/api/usuarios/12345678 \
  -H "Authorization: Bearer {jwt-token}"
```
**Respuesta exitosa (200):**
```json
{
  "dni": 12345678,
  "email": "juan@example.com",
  "nombre": "Juan",
  "apellido": "Pérez"
}
```

### Actualizar usuario
```bash
curl -X PATCH http://localhost:8080/api/usuarios/12345678 \
  -H "Authorization: Bearer {jwt-token}" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Carlos",
    "apellido": "Pérez García"
  }'
```

### Eliminar usuario
```bash
curl -X DELETE http://localhost:8080/api/usuarios/12345678 \
  -H "Authorization: Bearer {jwt-token}"
```
**Respuesta exitosa: 204 No Content**

---

## Tiendas (GET público, POST/PATCH protegido)

### Crear tienda (multipart)
```bash
curl -X POST http://localhost:8080/api/tiendas \
  -H "Authorization: Bearer {jwt-token}" \
  -F "tienda={\"nombreUrl\": \"mi-tienda\", \"nombreFantasia\": \"Mi Tienda\", \"descripcion\": \"Tienda de ropa\", \"vendedorDni\": 12345678}" \
  -F "file=@/path/to/logo.jpg"
```
**Respuesta exitosa (201):**
```json
{
  "id": 1,
  "nombreUrl": "mi-tienda",
  "nombreFantasia": "Mi Tienda",
  "logo": "https://res.cloudinary.com/.../logo.jpg",
  "descripcion": "Tienda de ropa",
  "vendedorDni": 12345678,
  "vendedorNombre": "Juan Pérez"
}
```

### Obtener tienda por URL (público)
```bash
curl -X GET http://localhost:8080/api/tiendas/mi-tienda
```

### Actualizar tienda (multipart)
```bash
curl -X PATCH http://localhost:8080/api/tiendas/mi-tienda \
  -H "Authorization: Bearer {jwt-token}" \
  -F "tienda={\"nombreFantasia\": \"Mi Tienda Actualizada\"}" \
  -F "file=@/path/to/new-logo.jpg"
```

---

## Productos

### Crear producto (multipart, protegido)
```bash
curl -X POST http://localhost:8080/api/tiendas/mi-tienda/productos \
  -H "Authorization: Bearer {jwt-token}" \
  -F "producto={\"categoriaId\": 2, \"nombre\": \"Camiseta Azul\", \"descripcion\": \"Camiseta 100% algodón\", \"precio\": 1999.0, \"stock\": 50}" \
  -F "file=@/path/to/camiseta.jpg"
```
**Respuesta exitosa (201):**
```json
{
  "id": 10,
  "categoriaId": 2,
  "nombre": "Camiseta Azul",
  "descripcion": "Camiseta 100% algodón",
  "precio": 1999.0,
  "stock": 50,
  "categoriaNombre": "Ropa",
  "imagen": "https://res.cloudinary.com/.../camiseta.jpg"
}
```

### Listar productos de una tienda (protegido)
```bash
curl -X GET "http://localhost:8080/api/tiendas/mi-tienda/productos" \
  -H "Authorization: Bearer {jwt-token}"
```

### Listar productos con ordenamiento
```bash
curl -X GET "http://localhost:8080/api/tiendas/mi-tienda/productos?sort=precio,desc" \
  -H "Authorization: Bearer {jwt-token}"
```

### Buscar productos por nombre
```bash
curl -X GET "http://localhost:8080/api/tiendas/mi-tienda/productos/buscar?q=camiseta" \
  -H "Authorization: Bearer {jwt-token}"
```

### Filtrar productos por categoría
```bash
curl -X GET "http://localhost:8080/api/tiendas/mi-tienda/productos/categoria/2" \
  -H "Authorization: Bearer {jwt-token}"
```

### Obtener producto por ID
```bash
curl -X GET http://localhost:8080/api/tiendas/mi-tienda/productos/10 \
  -H "Authorization: Bearer {jwt-token}"
```

### Actualizar producto
```bash
curl -X PATCH http://localhost:8080/api/tiendas/mi-tienda/productos/10 \
  -H "Authorization: Bearer {jwt-token}" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Camiseta Azul (Talla M)",
    "precio": 2199.0,
    "stock": 45
  }'
```

### Eliminar producto
```bash
curl -X DELETE http://localhost:8080/api/tiendas/mi-tienda/productos/10 \
  -H "Authorization: Bearer {jwt-token}"
```
**Respuesta exitosa: 204 No Content**

---

## Carrito (protegido)

### Agregar producto al carrito
```bash
curl -X POST http://localhost:8080/api/tiendas/mi-tienda/carrito/agregar \
  -H "Authorization: Bearer {jwt-token}" \
  -H "Content-Type: application/json" \
  -d '{
    "usuarioDni": 12345678,
    "productoId": 10,
    "cantidad": 2
  }'
```
**Respuesta exitosa (200):**
```json
{
  "idItem": 55,
  "productoId": 10,
  "nombreProducto": "Camiseta Azul",
  "imagenProducto": "https://res.cloudinary.com/.../camiseta.jpg",
  "precioUnitario": 1999.0,
  "cantidad": 2,
  "subtotal": 3998.0,
  "tiendaId": 1,
  "nombreTienda": "mi-tienda"
}
```

### Ver carrito del usuario
```bash
curl -X GET http://localhost:8080/api/tiendas/mi-tienda/carrito/12345678 \
  -H "Authorization: Bearer {jwt-token}"
```
**Respuesta exitosa (200) — Array de CarritoResponse**

### Eliminar item del carrito
```bash
curl -X DELETE http://localhost:8080/api/tiendas/mi-tienda/carrito/item/55 \
  -H "Authorization: Bearer {jwt-token}"
```
**Respuesta exitosa: 204 No Content**

### Vaciar carrito del usuario
```bash
curl -X DELETE http://localhost:8080/api/tiendas/mi-tienda/carrito/vaciar/12345678 \
  -H "Authorization: Bearer {jwt-token}"
```
**Respuesta exitosa: 204 No Content**

---

## Pedidos (protegido)

### Crear pedido
```bash
curl -X POST http://localhost:8080/api/tiendas/mi-tienda/pedidos \
  -H "Authorization: Bearer {jwt-token}" \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "PENDIENTE",
    "total": 3998.0,
    "items": [
      {
        "cantidad": 2,
        "precioUnitario": 1999.0,
        "nombreProducto": "Camiseta Azul",
        "descripcionProducto": "Camiseta 100% algodón",
        "idProducto": 10
      }
    ],
    "usuarioDni": 12345678,
    "metodoEnvio": "Envío a domicilio",
    "direccionEnvio": "Calle Principal 123, Apt 4B",
    "costoEnvio": 500.0
  }'
```
**Respuesta exitosa (201):**
```json
{
  "id": 1,
  "estado": "PENDIENTE",
  "total": 4498.0,
  "usuarioDni": 12345678,
  "tiendaId": 1,
  "fechaCreacion": "2025-12-02T14:30:00",
  "items": [...],
  "metodoEnvio": "Envío a domicilio",
  "direccionEnvio": "Calle Principal 123, Apt 4B",
  "costoEnvio": 500.0
}
```

### Listar pedidos de una tienda
```bash
curl -X GET http://localhost:8080/api/tiendas/mi-tienda/pedidos \
  -H "Authorization: Bearer {jwt-token}"
```

### Listar pedidos por usuario
```bash
curl -X GET http://localhost:8080/api/tiendas/mi-tienda/pedidos/usuario/12345678 \
  -H "Authorization: Bearer {jwt-token}"
```

### Obtener pedido por ID
```bash
curl -X GET http://localhost:8080/api/tiendas/mi-tienda/pedidos/1 \
  -H "Authorization: Bearer {jwt-token}"
```

### Actualizar pedido
```bash
curl -X PATCH http://localhost:8080/api/tiendas/mi-tienda/pedidos/1 \
  -H "Authorization: Bearer {jwt-token}" \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "ENVIADO"
  }'
```

### Eliminar pedido
```bash
curl -X DELETE http://localhost:8080/api/tiendas/mi-tienda/pedidos/1 \
  -H "Authorization: Bearer {jwt-token}"
```
**Respuesta exitosa: 204 No Content**

---

## Pagos (MercadoPago)

### Crear link de pago (protegido)
```bash
curl -X POST http://localhost:8080/api/pagos/crear/1 \
  -H "Authorization: Bearer {jwt-token}"
```
**Respuesta exitosa (200):**
```json
{
  "url": "https://www.mercadopago.com/checkout/v1/redirect?preference-id=123456789"
}
```

### Webhook de MercadoPago (público)
```bash
curl -X POST "http://localhost:8080/api/pagos/webhook?topic=payment&id=9999999999" \
  -H "Content-Type: application/json"
```
**Respuesta exitosa: 204 No Content o 200 OK**

---

## Storage / Cloudinary (protegido)

### Subir imagen
```bash
curl -X POST http://localhost:8080/api/storage/upload \
  -H "Authorization: Bearer {jwt-token}" \
  -F "file=@/path/to/image.jpg"
```
**Respuesta exitosa (200):**
```json
{
  "url": "https://res.cloudinary.com/dxxxxxx/image/upload/v1234567890/xyz123.jpg"
}
```

---

## Códigos de error comunes

| Código | Descripción |
|--------|-------------|
| 400    | Bad Request — validación de DTOs, campos faltantes o valores inválidos |
| 401    | Unauthorized — token inválido, expirado o ausente |
| 403    | Forbidden — acceso no autorizado al recurso |
| 404    | Not Found — entidad no encontrada (usuario, producto, pedido, etc.) |
| 500    | Internal Server Error — error del servidor |

---

## Notas
- **JWT Token:** Obtén el token del endpoint `/api/auth/register` o `/api/auth/login` y úsalo en el header `Authorization: Bearer <token>`.
- **Multipart/form-data:** Para endpoints que suben archivos, usa la opción `-F` en curl (como se muestra en Tiendas, Productos y Storage).
- **JSON:** Para payloads JSON, usa `-H "Content-Type: application/json"` y `-d '{...}'`.
- **Reemplaza valores:** Cambia DNI, IDs de producto, tienda, email, etc. por valores reales o creados en tu instancia local.
- **LocalHost:** Si ejecutas desde otra máquina, reemplaza `http://localhost:8080` con la URL real del servidor.

---

*Última actualización: 02/12/2025*
