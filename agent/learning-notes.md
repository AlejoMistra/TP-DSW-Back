# Conceptos Clave y Aprendizaje: Mercado Pago Checkout Pro (Orders API)

Este documento reúne los conceptos teóricos y prácticos fundamentales para comprender el funcionamiento de una pasarela de pagos moderna en un entorno backend con Node.js, Express y TypeScript.

---

## 1. ¿Qué es Checkout Pro y por qué se utiliza?

En el ecosistema de comercio electrónico existen dos grandes modelos de integración de pagos:

1. **Checkout Transparente (Custom Checkout / Payment API):**
   - El usuario ingresa los datos de su tarjeta directamente en el formulario de la aplicación.
   - **Ventaja:** La experiencia de usuario no sale nunca de tu plataforma.
   - **Desventaja y Riesgo:** Exige cumplimiento normativo estricto (**PCI-DSS**) para manipulación de datos sensibles de tarjetas bancarias, tokenización y mayor complejidad de seguridad.

2. **Checkout Pro (Redirect / Hosted Checkout):**
   - El backend crea una intención de pago (Orden o Preferencia) y obtiene un enlace (`checkout_url` o `init_point`).
   - El cliente es redirigido a una página segura alojada por Mercado Pago (o se abre en un modal seguro).
   - El cliente abona utilizando saldo en cuenta de Mercado Pago, tarjetas de crédito/débito guardadas, cuotas, o medios en efectivo (Rapipago/Pago Fácil).
   - **Ventajas:** 
     - **Cero riesgo PCI-DSS:** Tu backend nunca ve ni almacena números de tarjeta ni códigos de seguridad.
     - **Menor mantenimiento:** Nuevas promociones y medios de pago se habilitan automáticamente.
     - **Mayor conversión:** Millones de usuarios ya tienen sus tarjetas y billetera registradas en Mercado Pago.

---

## 2. Orders API vs. Preferences API

Mercado Pago cuenta históricamente con dos formas de iniciar un flujo de Checkout Pro:

| Característica | Preferences API (Clásico) | Orders API (Moderno / Estándar Actual) |
| :--- | :--- | :--- |
| **Endpoint** | `POST /checkout/preferences` | `POST /v1/orders` |
| **Respuesta de Redirección** | `init_point` / `sandbox_init_point` | `checkout_url` |
| **Visión de Dominio** | Centrado en la *pantalla de pago* (preferencia). | Centrado en la *orden de compra unificada* (gestión completa del ciclo de vida del pedido). |
| **Canales unificados** | Solo Checkout Pro web. | Soporta flujos omnicanal (Checkout Pro online, Point, QR, integraciones automáticas y manuales). |
| **Modo de procesamiento** | Implícito para Checkout Pro. | Explícito: `type: "online"`, `processing_mode: "manual"` genera el Checkout Pro. |
| **Soporte & Roadmap** | Estable pero en mantenimiento para retrocompatibilidad. | Es la API prioritaria donde Mercado Pago despliega sus nuevas funcionalidades y mejoras de webhook. |

---

## 3. Modelo de Autenticación y Credenciales

Mercado Pago opera con un esquema basado en Tokens:

- **Access Token (`TEST-...` o `APP_USR-...`):**
  - **Ubicación:** **EXCLUSIVAMENTE EN EL BACKEND** (en variables de entorno `.env`).
  - **Función:** Autentica cada petición REST o SDK ante la API de Mercado Pago mediante el encabezado `Authorization: Bearer <ACCESS_TOKEN>`.
  - **Peligro:** Nunca debe enviarse al cliente web ni comitearse en repositorios Git.
- **Public Key (`TEST-...` o `APP_USR-...`):**
  - Se utiliza en el frontend si se montan componentes visuales (Bricks) o SDK cliente.
- **Webhook Secret:**
  - Clave secreta configurada en el panel de desarrollador para verificar criptográficamente (HMAC-SHA256) que los webhooks entrantes provienen auténticamente de Mercado Pago y no de un atacante.

### Cuentas de Prueba (Test Users)
Para probar Checkout Pro con Orders API no se puede pagar a uno mismo con la misma cuenta del vendedor:
- **Cuenta Vendedor (Seller Test):** Dueña de las credenciales de la app (Access Token).
- **Cuenta Comprador (Buyer Test):** Usuario de prueba que inicia sesión en la pantalla de Checkout Pro para abonar con saldo o tarjetas ficticias.
- **Tarjetas de Prueba:** Números provistos por Mercado Pago que simulan aprobaciones inmediatas, fondos insuficientes o rechazos.

---

## 4. Ciclo de Vida del Pago Asíncrono y Webhooks

Un error común al empezar con pasarelas de pago es asumir que la respuesta de creación de la orden confirma que el dinero ingresó. **El proceso es asíncrono:**

```
[Cliente] --------(1) Solicita pagar plan--------> [Backend]
                                                        | (2) Guarda Payment PENDING
                                                        | (3) POST /v1/orders a MP
[Cliente] <-------(4) Recibe checkout_url <------------+
    |
    v (5) Redirige a MP Checkout Pro
[Pantalla MP] ---> Usuario ingresa tarjeta de prueba y confirma
    |
    +----(6) Notificación Webhook (POST) ---------> [Backend]
    |                                                    | (7) Verifica firma HMAC
    |                                                    | (8) Consulta estado en MP
    |                                                    | (9) Transacción DB:
    |                                                    |     - Payment -> APPROVED
    |                                                    |     - Membership -> ACTIVE
    |                                                    | (10) Retorna HTTP 200
    v
[Cliente] <-------(11) Redirección back_urls <---------+
```

### Principios Fundamentales del Backend para Pagos:
1. **Idempotencia:** Un webhook puede ser reenviado múltiples veces por reintentos de red. Si recibimos 3 veces la notificación del mismo pago, la membresía debe extenderse **una sola vez**.
2. **Referencia Externa (`external_reference`):** Es el identificador único que nuestro sistema asigna a la transacción (ej. `PAY_MEM_42_1740000000`). Se envía a Mercado Pago y regresa en cada evento para saber a qué registro interno pertenece sin ambigüedades.
3. **No confiar en la redirección del navegador (`back_urls`):** El usuario podría cerrar la pestaña tras pagar antes de volver a nuestra web. **El único origen de verdad para impactar la base de datos es el Webhook backend-a-backend.**

---

## 5. Estrategia para Desarrollo Local (Academic Friendly)

Dado que Mercado Pago no puede enviar un webhook HTTP a `http://localhost:3000`:
- **Opción A (Túnel Ngrok / Cloudflare Tunnel):** Expone temporalmente un puerto local a una URL pública HTTPS (ej. `https://random-id.ngrok-free.app/api/payments/webhook`) para recibir notificaciones reales de Mercado Pago.
- **Opción B (Mock / Endpoint de Simulación para Tests):** Para trabajar desconectado o en tests automatizados, un script o test de integración simula el payload de webhook hacia el handler.

Ambos enfoques se contemplan en el plan de implementación.

