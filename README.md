# 🔥 Fogón Institucional - Sistema de Control de Accesos

<div align="center">
  <img src="https://img.shields.io/badge/Status-En_Producci%C3%B3n-success" alt="Status">
  <img src="https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white" alt="Vercel">
  <img src="https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white" alt="PostgreSQL (Insforge)">
  <img src="https://img.shields.io/badge/Resend-000000?logo=maildotru&logoColor=white" alt="Resend API">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript">
</div>

<br>

Un sistema de grado empresarial desarrollado para la gestión integral de invitados y validación de entradas mediante códigos QR para eventos institucionales. 

## 🚀 Características Principales

- **Registro de Invitados:** Portal público de inscripción integrado con base de datos en tiempo real.
- **Generación Automática de QR:** Creación de tickets digitales únicos con UUID.
- **Envío Transaccional de Correos:** Integración con Resend para el envío automatizado de las entradas QR a los asistentes.
- **Panel de Seguridad (Guardias):** Aplicación web móvil con escáner QR integrado para control de accesos en puerta.
- **Doble Flujo de Seguridad QR:** Protección contra escaneos no autorizados. Si un civil escanea el QR, es redirigido a una página de error. Solo el escáner del guardia puede extraer el token y validarlo en la base de datos. ([Ver Arquitectura de Seguridad](./documents/qr_security_architecture.md)).
- **Mesa de Ayuda (Admin Panel):** Dashboard en tiempo real para visualizar estados (*Pendiente, Entregado, Asistió*), con búsqueda avanzada por DNI o Nombre.

## 🛠️ Stack Tecnológico

El proyecto está diseñado sobre una arquitectura Serverless y en la nube para asegurar alta disponibilidad.

*   **Hosting / Serverless Backend:** [Vercel](https://vercel.com/)
*   **Base de Datos Relacional:** Insforge (PostgreSQL)
*   **Servidor de Correos:** [Resend API](https://resend.com)
*   **Lógica de Frontend / Escáner:** JavaScript Vanilla, HTML5-QRCode

## 📂 Arquitectura y Desafíos Técnicos

Puedes leer un análisis detallado sobre cómo se resolvió el problema de seguridad en la lectura de los códigos QR (Prevención de escaneo no autorizado) en el siguiente documento:
- 📖 [Caso de Estudio: Arquitectura de Seguridad QR (Double-Flow)](./documents/qr_security_architecture.md)

Este proyecto fue desarrollado como una solución *end-to-end* (desde el diseño de la arquitectura y la base de datos, hasta el despliegue en la nube y puesta en producción), demostrando capacidad para construir sistemas críticos, escalables y seguros.

## 👨‍💻 Sobre el Desarrollador

Desarrollado por **Ángel Tarcaya** (Angel Dev Technology).

Soy un desarrollador enfocado en crear soluciones tecnológicas eficientes, modernas y seguras para negocios y eventos.

*   ✉️ **Contacto:** angeltarcaya.dev@gmail.com

---
*Este repositorio es una muestra de código (Showcase) para fines de portafolio y demostración de habilidades técnicas.*
