# 🔥 Fogón Institucional 2026

### Sistema de registro y control de accesos · usado en un evento real

[![Fogón Institucional 2026](https://angeltarcaya.vercel.app/assets/img/projects/fogon.jpg)](https://sytemfogon.digital)

![Estado](https://img.shields.io/badge/Estado-usado%20en%20un%20evento%20real-2E7D32?style=flat-square)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-InsForge-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=flat-square&logo=firebase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-hosting-000000?style=flat-square&logo=vercel&logoColor=white)
[![Licencia](https://img.shields.io/github/license/angeltarcayadev/fogon-system-showcase?label=licencia&style=flat-square)](https://github.com/angeltarcayadev/fogon-system-showcase/blob/main/LICENSE)

Plataforma web que digitalizó las entradas del **Fogón Institucional del Día del Profesor**, organizado por el **Colegio Secundario N.º 47 «Dr. René Favaloro»** de Libertador General San Martín (Jujuy). Emite entradas en PDF con código QR, valida cada ingreso en la puerta por QR o por DNI, da a la mesa de ayuda una vista en tiempo real de los asistentes y resuelve el sorteo en vivo entre los presentes.

Fue desarrollada como proyecto de **Prácticas Profesionalizantes** de la Tecnicatura Superior en Ciencias de Datos e Inteligencia Artificial del **IES N.º 10**, y se usó en el evento del **11 de septiembre de 2026**.

> 🎟️ **679 entradas** con QR emitidas y **601 ingresos** validados en puerta en una sola noche.

> 🔒 Por el acuerdo de confidencialidad con el colegio, este repositorio es una muestra: no tiene datos personales ni el código completo.

## Miralo

[![Sitio](https://img.shields.io/badge/Sitio-sytemfogon.digital-FF6D00?style=for-the-badge&logo=googlechrome&logoColor=white&labelColor=101010)](https://sytemfogon.digital)
[![Arquitectura](https://img.shields.io/badge/Seguridad-arquitectura%20del%20QR-6A1B9A?style=for-the-badge&logo=letsencrypt&logoColor=white&labelColor=101010)](documents/qr_security_architecture.md)
[![Portafolio](https://img.shields.io/badge/Ver%20en-mi%20portafolio-E02D2D?style=for-the-badge&logo=googlechrome&logoColor=white&labelColor=101010)](https://angeltarcaya.vercel.app/proyectos/fogon-2026/)

## 📊 Resultados

| Indicador | Resultado |
| --- | --- |
| Docentes registrados | **679**, de **25** instituciones de la zona |
| Entradas emitidas (PDF con QR) | **679**, una por docente |
| Ingresos validados en puerta | **601** (88,5 %) |
| Instituciones con asistencia mayor al 75 % | **23 de 25** |
| Sorteo en vivo | Realizado desde la plataforma, solo entre presentes |
| Respaldo de datos | **679 de 679** registros migrados y verificados |

> Todos los números son totales del sistema. Por el acuerdo de confidencialidad con la dirección del colegio, este repositorio **no contiene datos personales** de los asistentes ni el código fuente completo.

---

## 🧩 El problema

El colegio tenía cientos de entradas vendidas desde principios de año, registradas en planillas de papel, y necesitaba:

- Controlar el ingreso de **cientos de docentes en una sola noche**, sin filas eternas.
- **Verificar la identidad** de cada asistente: entradas personales e intransferibles, con DNI.
- Que **una misma entrada no pudiera usarse dos veces**.
- Resolver consultas en el momento: docentes sin el QR, entradas observadas.
- **Proteger los datos personales** de los docentes.

## ✅ La solución

### Módulos

| Módulo | Ruta | Rol | Qué hace |
| --- | --- | --- | --- |
| Registro público | `/` | Público | Registro del docente y su institución; genera la entrada |
| Ticket | — | Público | Entrada en PDF con QR única (UUID), lista para mostrar o imprimir |
| Guardia | `/guardia` | Seguridad | Escanea el QR o valida por DNI, con respuesta por colores |
| Mesa de ayuda | `/panel` | Admin | Busca por DNI, nombre o institución; filtra por estado y corrige manualmente |
| Sorteo | `/sorteo` | Admin | Sorteo en vivo solo entre presentes, sin repetir ganadores |

### Validación en puerta por colores

- 🟢 **Verde:** entrada válida, el docente ingresa.
- 🟡 **Amarillo:** entrada ya usada; se deriva a la mesa de ayuda.
- 🔴 **Rojo:** código inválido o entrada denegada.

### Capturas

| Control de acceso (guardia) | Escáner QR |
| :---: | :---: |
| ![Pantalla de control de acceso del módulo de guardia](./assets/04-guardia-control.png) | ![Escáner de QR del módulo de guardia](./assets/05-guardia-escaner.png) |
| **Ingreso manual por DNI** | **Mesa de ayuda** |
| ![Ingreso manual por DNI en el módulo de guardia](./assets/06-guardia-ingreso-manual.png) | ![Panel de mesa de ayuda con la lista de invitados](./assets/07-mesa-de-ayuda.png) |
| **Acceso restringido por rol** | **Políticas de sesión** |
| ![Pantalla de inicio de sesión del personal](./assets/03-login-acceso.png) | ![Pantalla informativa de seguridad de la sesión](./assets/02-login-seguridad.png) |

---

## 🏗️ Arquitectura

```mermaid
flowchart LR
    subgraph Navegadores
        A[Registro público /]
        B[Panel y sorteo · Admin]
        C[Guardia · Seguridad]
    end

    subgraph Vercel["Vercel · servidor Express"]
        D[Roles con sesión JWT]
        E[DB_PROVIDER elige la base]
        F[Tickets PDF · Puppeteer + Browserless]
    end

    G[(Firebase Firestore<br/>base activa)]
    H[(InsForge PostgreSQL<br/>base original, en pausa)]
    I[Google Cloud IAM<br/>Workload Identity Federation]

    A & B & C -- HTTPS --> Vercel
    Vercel -- 1. token OIDC --> I
    I -- 2. acceso temporal --> G
    Vercel -. alternativa .-> H
```

- **Backend serverless** con Express sobre Vercel.
- **Base de datos principal:** PostgreSQL (InsForge), con almacenamiento de los tickets PDF.
- **Base de respaldo:** Firebase Firestore. La variable `DB_PROVIDER` permite cambiar de base **sin tocar el código**.
- **Conexión sin claves** entre Vercel y Google Cloud mediante *Workload Identity Federation*: no hay credenciales guardadas en el servidor.
- **Tickets PDF** generados con Puppeteer y Browserless.
- **Escáner** en el navegador del celular con HTML5-QRCode.

## 🔐 Seguridad

- **Roles separados:** Admin entra por `/login-panel` al panel y al sorteo, y Seguridad entra por `/login` a la guardia, cada uno con sus credenciales.
- **Sesiones JWT en cookies HttpOnly**, con vencimiento automático.
- **Validación transaccional:** una entrada no puede ingresar dos veces, aunque se escanee en dos puertas al mismo tiempo.
- **QR de doble flujo:** si alguien escanea la entrada con la cámara común del celular, llega a una página de acceso restringido; solo el escáner de la guardia extrae el identificador y lo valida. 📖 [Ver el caso de estudio](./documents/qr_security_architecture.md)
- **Confidencialidad:** los datos se usaron solo dentro de la plataforma, como se acordó con la dirección del colegio.

---

## 📂 Contenido de este repositorio

Este es un **repositorio de muestra**: el código completo es privado por la confidencialidad de los datos.

```
├── assets/            → capturas de la plataforma
├── code_snippets/     → fragmentos de la validación QR y la generación de entradas
└── documents/         → caso de estudio de la arquitectura de seguridad QR
```

---

## 👥 Créditos

<h3 align="center">Desarrollo de la plataforma</h3>

<p align="center">
  <a href="https://github.com/angeltarcayadev">
    <img src="./assets/equipo/angel-tarcaya.png" alt="Foto de Angel Tarcaya" width="130">
  </a>
  <br>
  <strong>Angel Tarcaya</strong>
  <br>
  <sub>Desarrollo full stack · arquitectura · despliegue</sub>
</p>

<h3 align="center">Coordinación</h3>

<table align="center">
  <tr>
    <td align="center" width="200">
      <img src="./assets/equipo/damian-tejerina.png" alt="Damián Tejerina" width="110">
      <br>
      <strong>Damián Tejerina</strong>
      <br>
      <sub>Coordinación y nexo con la dirección del colegio</sub>
    </td>
    <td align="center" width="200">
      <img src="./assets/equipo/angel-tarcaya.png" alt="Angel Tarcaya" width="110">
      <br>
      <strong>Angel Tarcaya</strong>
      <br>
      <sub>Coordinación del equipo y del proyecto</sub>
    </td>
  </tr>
</table>

<h3 align="center">Colaboradores · equipo Arce Tech</h3>

<p align="center">
  Estudiantes de la Tecnicatura Superior en Ciencias de Datos e IA del IES N.º 10 que operaron el sistema durante el evento.
</p>

<table align="center">
  <tr>
    <td align="center" width="170">
      <img src="./assets/equipo/nicolas-arce.png" alt="Nicolás Arce" width="100">
      <br>
      <strong>Nicolás Arce</strong>
      <br>
      <sub>Seguridad (guardia) y carga de datos</sub>
    </td>
    <td align="center" width="170">
      <img src="./assets/equipo/luciano-vaca.png" alt="Luciano Vaca" width="100">
      <br>
      <strong>Luciano Vaca</strong>
      <br>
      <sub>Seguridad (guardia) y carga de datos</sub>
    </td>
    <td align="center" width="170">
      <img src="./assets/equipo/maxi-tamayo.png" alt="Maxi Tamayo" width="100">
      <br>
      <strong>Maxi Tamayo</strong>
      <br>
      <sub>Seguridad (guardia) y carga de datos</sub>
    </td>
  </tr>
</table>

<table align="center">
  <tr>
    <td align="center" width="170">
      <img src="./assets/equipo/facundo-saldano.png" alt="Facundo Saldaño" width="100">
      <br>
      <strong>Facundo Saldaño</strong>
      <br>
      <sub>Seguridad (guardia) y carga de datos</sub>
    </td>
    <td align="center" width="170">
      <img src="./assets/equipo/enzo-tamayo.png" alt="Enzo Tamayo" width="100">
      <br>
      <strong>Enzo Tamayo</strong>
      <br>
      <sub>Mesa de ayuda (panel Admin) y carga de datos</sub>
    </td>
  </tr>
</table>

### Instituciones

- **Institución destinataria:** Colegio Secundario N.º 47 «Dr. René Favaloro».
- **Institución formadora:** IES N.º 10, sede Fraile Pintado, en el marco de las Prácticas Profesionalizantes.

## Autor

**Angel Eduardo Tarcaya** · Desarrollador web · Datos e IA · Jujuy, Argentina

[![Portafolio](https://img.shields.io/badge/Portafolio-angeltarcaya.vercel.app-E02D2D?style=for-the-badge&logo=googlechrome&logoColor=white&labelColor=101010)](https://angeltarcaya.vercel.app/proyectos/fogon-2026/)
[![GitHub](https://img.shields.io/badge/GitHub-angeltarcayadev-181717?style=for-the-badge&logo=github&logoColor=white&labelColor=101010)](https://github.com/angeltarcayadev)
[![Email](https://img.shields.io/badge/Email-angeltarcaya.dev@gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white&labelColor=101010)](mailto:angeltarcaya.dev@gmail.com)

- **Institución destinataria:** Colegio Secundario N.º 47 «Dr. René Favaloro».
- **Institución formadora:** IES N.º 10, sede Fraile Pintado, en el marco de las Prácticas Profesionalizantes.

✉️ **Contacto:** angeltarcaya.dev@gmail.com
