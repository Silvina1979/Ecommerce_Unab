Plataforma de E-commerce (MVP)
Fecha de Presentación: 20/11/2025

repositorio Git: https://github.com/Silvina1979/Ecommerce_Unab


1. Resumen Ejecutivo
El presente proyecto consiste en el desarrollo de un MVP (Producto Mínimo Viable) de una plataforma de e-commerce que permite a los usuarios navegar un catálogo, agregar productos a un carrito de compras y completar un proceso básico de pago. 
El desarrollo se realizará aplicando metodologías ágiles utilizando tecnologías modernas de programación full stack.
2. Objetivos
Objetivo General: Desarrollar un MVP de e-commerce funcional 
Objetivos Específicos:
· Implementar un frontend con React.
· Construir un backend con Spring Boot exponiendo APIs REST.
· Diseñar y administrar una base de datos MySQL.
· Gestionar el proyecto con metodologías ágiles.
· Desplegar el sistema en la nube (AWS/GCP).
3. Metodología
El proyecto se gestionó bajo el marco ágil. Se definieron roles claros: dos desarrolladores, un QA y un DevOps. Se planificaron 5 sprints con una duración total desde el 23/08/2025 hasta el 20/11/2025.
4. Arquitectura
El sistema se diseñó bajo una arquitectura en tres capas (presentación, lógica y datos):
· Frontend: React.
· Backend: Spring Boot (Java) con APIs REST.
· Base de Datos: MySQL.
· Infraestructura: Docker y despliegue en AWS/GCP.
· Seguridad: autenticación JWT, cifrado de contraseñas, HTTPS.
5. Plan de Implementación (MVP)
El desarrollo se organizó en 5 sprints, cada uno con entregables definidos:
·Sprint 1: Setup (entornos, CI/CD, pruebas iniciales).
·Sprint 2: Modelado backend (entidades y controladores).
·Sprint 3: Catálogo y carrito.
·Sprint 4: Checkout y flujo de compra.
·Sprint 5: Deploy, documentación y presentación final.
La planificación detallada de tareas se encuentra en Asana: Proyecto e-commerce
 6. Diseño de Base de Datos
La base de datos se implementó en MySQL con las siguientes entidades principales:
·Usuario: información de clientes y credenciales.
·Producto: catálogo de productos disponibles.
·Pedido: registro de órdenes de compra.
·Carrito: productos en proceso de compra.
7. Gestión de Calidad
Se aplicaron pruebas en cada sprint para garantizar la calidad del software:
·Pruebas unitarias: JUnit en backend.
·Pruebas de integración: Postman.
·Pruebas end-to-end: Cypress en frontend.
· Pruebas de carga: k6/JMeter para validar rendimiento.
8. Costos y Recursos
Se estimó un costo total en horas/hombre considerando 4 roles (Dev1, Dev2, QA, DevOps). Se utilizaron principalmente tecnologías open source y servicios cloud en modalidad free tier.
