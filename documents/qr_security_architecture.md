# Arquitectura de Seguridad de Validaciones QR

Este documento describe la arquitectura implementada para la validación segura de entradas mediante códigos QR en el sistema del **Fogón Institucional**.

> **Nota:** este caso de estudio corresponde a la primera versión del sistema, en la que la entrada se enviaba por email. En la versión usada en el evento, la entrada se entregó como ticket en PDF con el mismo QR de doble flujo, y la validación pasó a ser transaccional (una entrada no puede ingresar dos veces). Los dominios de los ejemplos son ilustrativos.

## 1. El Problema de Seguridad (Threat Model)

En implementaciones iniciales, el código QR contenía en texto plano el Identificador Único Universal (UUID) de la entrada (por ejemplo: `b383-0df0e92f6bd4`). 
Esto presenta dos inconvenientes principales:
1. **Confusión de usuario:** Si el usuario escanea su propia entrada con la cámara de su celular por curiosidad, la cámara leerá el UUID como texto y buscará en la web, sin dar ninguna confirmación de validez o estado de la entrada, lo que genera confusión.
2. **Exposición de información cruda:** Aunque el UUID no exponga datos personales directamente, esparcir el ID sin contexto permite que cualquier software externo almacene los códigos sin restricciones ni feedback de error.

## 2. La Solución Adoptada: Doble Flujo (Double-Flow)

Para mitigar los problemas mencionados, se ha rediseñado la estructura de información inyectada dentro del Código QR, pasando de un texto plano a una **URL oficial de validación**.

### Estructura de la URL
El código QR generado por `emailService.js` ahora contiene el siguiente formato de datos:
`https://sistema-fogon.com/Pages/qr/qr-error.html?ticket={UUID}`

Esta aproximación permite dos flujos de interacción totalmente separados dependiendo de **quién** escanea el código:

### Flujo 1: Usuario No Autorizado (Cámara de Celular Normal)
Cuando cualquier persona utiliza su teléfono celular para escanear el código QR impreso o en la pantalla, ocurrirá lo siguiente:
1. La aplicación de cámara nativa del teléfono detectará que el contenido es una URL web válida.
2. Sugerirá al usuario abrir el enlace en el navegador por defecto (Chrome, Safari, etc.).
3. El navegador resolverá el host `sistema-fogon.com` e ingresará a la ruta `/Pages/qr/qr-error.html`.
4. El servidor entregará una **Página Estática HTML de Error** (Acceso Restringido), explicando claramente al usuario que ese código únicamente tiene propósitos de control interno y no hay acciones que el usuario pueda realizar allí.
5. *Resultado:* Seguridad por diseño. Se previene el acceso no autorizado y se aclaran las expectativas del usuario.

### Flujo 2: Personal Autorizado (Panel de Seguridad)
El personal de validación (guardias) en la puerta del evento utiliza el módulo de seguridad ubicado en `/Pages/seguridad`.
1. El panel utiliza la biblioteca `html5-qrcode` para acceder a la webcam y escanear el boleto.
2. Al escanear, el script captura la cadena completa: `https://sistema-fogon.com/Pages/qr/qr-error.html?ticket={UUID}`.
3. El script `guardia-logic.js` está programado para **no navegar a esa URL**. En su lugar, intercepta la cadena, reconoce el protocolo `http/https` y parsea el objeto `URL`.
4. Silenciosamente, extrae únicamente el parámetro llamado `ticket`.
5. Ejecuta un HTTP POST request directo hacia el backend local en `/api/validar` usando ese ID extraído.
6. *Resultado:* La validación se lleva a cabo sin fisuras ni desvíos hacia páginas de error.

## 3. Implementación de Código Relevante

**Generación (Backend):**
```javascript
// emailService.js
const qrDataUrl = `https://sistema-fogon.com/Pages/qr/qr-error.html?ticket=${datosEntrada.id}`;
const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrDataUrl)}&color=000000&bgcolor=ffffff`;
```

**Intercepción (Frontend Scanner):**
```javascript
// guardia-logic.js
let idLimpio = identificador;
if (identificador.startsWith('http')) {
    const urlObj = new URL(identificador);
    idLimpio = urlObj.searchParams.get('ticket') || identificador;
}
// POST a la API usando idLimpio
```
