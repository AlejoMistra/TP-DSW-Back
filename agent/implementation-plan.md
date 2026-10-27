# Plan Maestro de Implementación: Mercado Pago Checkout Pro (Orders API)

**Proyecto:** Back-TP-DSW (Gestión de Gimnasio)  
**Objetivo Académico:** Implementar de punta a punta una pasarela de pago real (Mercado Pago Checkout Pro) utilizando la moderna **Orders API**, comprendiendo los principios de diseño de software asíncrono, seguridad en pasarelas, idempotencia, modelado relacional y manejo de eventos vía Webhooks.

---

## 🧭 Metodología de Trabajo y Aprendizaje

Para maximizar el aprendizaje y no perder contexto entre sesiones:
- Cada fase se ejecuta y valida de manera incremental.
- Antes de cada cambio de código, se explica el *por qué* y la alternativa de diseño elegida.
- Se mantendrán las pruebas unitarias e integración en verde en todo momento (`vitest`).
- Se documentarán las pruebas manuales usando archivos `.http` para ejecución directa en el IDE.

---

## 📋 Fases del Proyecto

### Fase 0: Preparación del Entorno y Credenciales
- [ ] **0.1.** Registrar variables de entorno requeridas en `.env.example` y `.env`:
  - `MERCADO_PAGO_ACCESS_TOKEN`: Token de prueba provisto por la app de Mercado Pago Developers.
  - `MERCADO_PAGO_WEBHOOK_SECRET`: Clave de firma para validación de webhooks.
  - `MERCADO_PAGO_BACK_URL_SUCCESS`: URL del frontend para pago exitoso.
  - `MERCADO_PAGO_BACK_URL_FAILURE`: URL del frontend para pago fallido.
  - `MERCADO_PAGO_BACK_URL_PENDING`: URL del frontend para pago pendiente.
- [ ] **0.2.** Instalar el SDK oficial de Mercado Pago (`pnpm add mercadopago`).
- [ ] **0.3.** Verificar la compilación TypeScript y tests existentes (`vitest run`).

*Concepto de Aprendizaje:* Gestión segura de secretos en el backend, desacoplamiento de credenciales por ambiente (Sandbox vs Producción).

---

### Fase 1: Evolución del Modelo de Datos (Prisma)
- [ ] **1.1.** Analizar y actualizar `prisma/schema.prisma`:
  - Agregar enum `PaymentStatus` (`PENDING`, `APPROVED`, `REJECTED`, `CANCELLED`).
  - Actualizar enum `PaymentMethod` (agregar valor `MERCADO_PAGO` si corresponde).
  - Enriquecer `model Payment`:
    - `status PaymentStatus @default(APPROVED)` (para mantener compatibilidad con pagos manuales existentes).
    - `externalReference String? @unique` (identificador único de orden/pago).
    - `gatewayOrderId String?` (ID de la orden en Mercado Pago).
    - `gatewayPaymentId String?` (ID del pago reportado por Mercado Pago).
- [ ] **1.2.** Generar y ejecutar la migración Prisma (`npx prisma migrate dev --name add_payment_gateway_fields`).
- [ ] **1.3.** Re-generar clientes y esquemas Zod (`npx prisma generate`).
- [ ] **1.4.** Adaptar `payment.repository.ts` y métodos auxiliares para soportar los nuevos campos opcionales (`findByExternalReference`, `updateStatusByExternalReference`).

*Concepto de Aprendizaje:* Migraciones de base de datos no disruptivas (Backward Compatibility) y modelado de máquinas de estado en tablas relacionales.

---

### Fase 2: Capa de Integración con Mercado Pago (Client & Service Wrapper)
- [ ] **2.1.** Crear cliente de configuración `src/config/mercadopago.config.ts`.
- [ ] **2.2.** Crear `src/modules/payment/mercadopago.service.ts`:
  - Método `createCheckoutOrder(params)`: construye el payload para Orders API (`type: "online"`, `processing_mode: "manual"`, `items`, `payer`, `external_reference`), incluye cabecera obligatoria `X-Idempotency-Key` (UUID) y obtiene `checkout_url`.
  - Método `getOrderById(orderId)`: consulta `GET /v1/orders/{orderId}` a la API de Mercado Pago para verificar su estado real (`status === 'processed'`).
  - Método `verifyWebhookSignature(signatureHeader, requestIdHeader, dataId)`: valida la autenticidad del webhook entrante utilizando la clave secreta HMAC-SHA256 (`x-signature`).
- [ ] **2.3.** Diseñar pruebas unitarias con mock de la SDK de Mercado Pago.

*Concepto de Aprendizaje:* Patrón Adapter / Gateway Wrapper para aislar librerías de terceros del dominio de negocio.

---

### Fase 3: Endpoint de Creación de Orden de Pago
- [ ] **3.1.** Definir contratos en `payment.schemas.ts`:
  - Esquema `CreateCheckoutOrderSchema`: validación del `membershipPlanId` deseado.
  - Esquema de respuesta: `{ checkoutUrl: string, externalReference: string, orderId: string }`.
- [ ] **3.2.** Implementar en `PaymentService`:
  - Lógica para verificar que el socio (`MEMBER`) solicitante exista y tenga una membresía activa o por renovar.
  - Cálculo de fechas `periodStart` y `periodEnd` basadas en la duración del plan seleccionado.
  - Creación del registro `Payment` en la base de datos con estado `PENDING`.
  - Invocación a `MercadoPagoService.createCheckoutOrder`.
  - Actualización del `gatewayOrderId` en la base de datos.
- [ ] **3.3.** Agregar controlador y ruta en `payment.routes.ts`:
  - `POST /api/payments/checkout-order` (protegido por `authenticate` y `authorize(UserRole.MEMBER)`).
- [ ] **3.4.** Crear petición de prueba en `test/mercadopago.http` para probar la generación del link de pago en vivo.

*Concepto de Aprendizaje:* Transacciones optimistas, preparación del estado previo a la redirección del usuario y flujos orientados al socio.

---

### Fase 4: Endpoint de Webhooks y Procesamiento Asíncrono
- [ ] **4.1.** Definir ruta pública `POST /api/payments/webhook`:
  - Debe omitir el middleware de autenticación JWT (ya que es invocado por los servidores de Mercado Pago).
  - Configurado en el Dashboard bajo el tópico **Order (Mercado Pago)** (`type: "order"`).
  - Lectura de cabeceras de firma (`x-signature`, `x-request-id`) y parámetros (`data.id`).
- [ ] **4.2.** Implementar el procesamiento de la notificación en `PaymentService`:
  - Búsqueda del `Payment` por `externalReference` o `gatewayOrderId`.
  - Consulta a la API de Mercado Pago (`GET /v1/orders/{id}`) para verificar que el estado sea `processed` y `status_detail` sea `accredited` (Source of Truth check).
  - Manejo de Idempotencia: Si el pago ya fue marcado como `APPROVED`, no procesar ni extender la membresía dos veces.
  - Si el pago está aprobado:
    - Actualizar `Payment` a `APPROVED` y registrar `paymentDate`.
    - Actualizar `Membership`: extender `endDate` y cambiar `status` a `ACTIVE`.
- [ ] **4.3.** Responder inmediatamente con `HTTP 200 OK` para confirmar recepción.

*Concepto de Aprendizaje:* Seguridad en webhooks (HMAC verification), prevención de ataques de repetición, idempotencia y actualización transaccional en bases de datos relacionales.

---

### Fase 5: Pruebas, Simulación y Validación de Flujo Completo
- [ ] **5.1.** Configurar pruebas de integración y simulación de webhooks:
  - Crear script o tests automatizados que simulen el envío de un webhook aprobado y uno rechazado.
- [ ] **5.2.** Guía práctica para exponer el backend con túnel local (`ngrok` o `cloudflared`) y probar con las tarjetas de prueba de Mercado Pago.
- [ ] **5.3.** Verificar que todos los tests unitarios e integrales del proyecto continúen pasando.

---

## 🎯 Criterios de Aceptación y Entrega
1. Un socio puede autenticarse y generar un link de Checkout Pro (`checkout_url`) para pagar o renovar su plan.
2. Al ingresar al link con una cuenta de prueba de comprador y tarjeta de prueba, el flujo de Mercado Pago responde satisfactoriamente.
3. El webhook recibe la notificación, valida su firma, actualiza el pago a `APPROVED` y activa la membresía en la base de datos.
4. Código limpio, tipado, siguiendo los patrones del repositorio y con cobertura de tests.

