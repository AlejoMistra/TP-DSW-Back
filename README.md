# Backend - Sistema de gestión de gimnasio

API REST para administrar socios, membresías, planes, pagos, instructores, ejercicios, rutinas, horarios, sesiones y reservas de clases.

## Stack

- Node.js
- Express 5
- TypeScript
- Prisma ORM
- MariaDB/MySQL
- Zod
- CORS

## Patrones y estructura

El proyecto sigue una organización modular por dominio dentro de `src/modules` y una separación por capas:

- `routes`: define los endpoints HTTP y asocia los middlewares de validación a las acciones del controlador.
- `controller`: gestiona el flujo de la petición HTTP, recibe los datos validados (`req.validated`), invoca a la capa de servicio y envía la respuesta HTTP con el código de estado correspondiente.
- `service`: concentra las reglas de negocio, validaciones de dominio, transacciones y coordinación entre repositorios.
- `repository`: encapsula el acceso a datos y las operaciones contra la base de datos utilizando Prisma Client.
- `schemas`: define los esquemas de validación de entrada (body, params, query) con Zod y proporciona inferencia de tipos estáticos en TypeScript. Se apoya en `prisma-zod-generator`, que genera automáticamente esquemas base de validación a partir de anotaciones y reglas definidas directamente en `prisma/schema.prisma` (mediante directivas `/// @zod.*` como `@zod.min`, `@zod.email`, `@zod.custom.use`), asegurando coherencia entre el modelo de datos y la validación en capa de aplicación.

Además, hoy se observan estos patrones de soporte:

- `src/middlewares/validate.middleware.ts`: middleware genérico para validación de requests (body, params, query) con esquemas Zod, inyectando el resultado en `req.validated`.
- `src/middlewares/errorHandler.middleware.ts`: middleware centralizado de Express para manejo uniforme de errores (`ZodError`, `AppError` y errores no controlados).
- `src/utils/errors.ts`: jerarquía de errores personalizados de aplicación (`AppError`, `NotFoundError`, `ConflictError`, `UnauthorizedError`).
- `src/shared/instances.ts`: composición e inyección manual de dependencias (instanciación de repositorios, servicios y controladores).
- `src/lib/prisma.ts`: instancia compartida de Prisma Client configurada con `@prisma/adapter-mariadb`.

## Estructura principal

```text
src/
├── app.ts
├── server.ts
├── lib/
│   └── prisma.ts
├── middlewares/
│   ├── errorHandler.middleware.ts
│   └── validate.middleware.ts
├── shared/
│   ├── common.schemas.ts
│   ├── constants.ts
│   └── instances.ts
├── utils/
│   ├── errors.ts
│   ├── errorHandler.ts
│   ├── stringUtils.ts
│   └── timeUtils.ts
└── modules/
    ├── classBooking/
    ├── classSchedule/
    ├── classSession/
    ├── exercise/
    ├── instructor/
    ├── member/
    ├── membership/
    ├── membershipPlan/
    ├── payment/
    ├── routine/
    └── routineExercise/
```

Cada módulo típicamente implementa:
- `[dominio].routes.ts`: definición de rutas y middlewares de validación
- `[dominio].controller.ts`: controladores HTTP
- `[dominio].service.ts`: lógica de negocio
- `[dominio].repository.ts`: acceso a datos con Prisma
- `[dominio].schemas.ts`: esquemas de validación Zod

## Instalación y ejecución

### Requisitos

- Node.js 18 o superior
- npm (o gestor compatible)
- Base de datos MariaDB/MySQL disponible

### Variables de entorno

Crear un archivo `.env` en la raíz con, como mínimo:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=mysql://user:password@localhost:3306/database
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=user
DATABASE_PASSWORD=password
DATABASE_NAME=database
```

> `DATABASE_URL` es utilizada por la CLI de Prisma (`prisma.config.ts`) para migraciones, mientras que las variables `DATABASE_*` individuales son consumidas en tiempo de ejecución por el adaptador `@prisma/adapter-mariadb`.

### Scripts

- `npm run dev`: compila en modo watch y levanta el servidor
- `npm run build`: compila el proyecto TypeScript
- `npm run db:migrate`: aplica o genera migraciones de base de datos con Prisma
- `npm run db:generate`: genera el cliente de Prisma y esquemas de validación Zod
- `npm run db:seed`: ejecuta el seeder para poblar datos iniciales

### Puesta en marcha

```bash
npm install
npm run db:generate
npm run db:migrate
npm run db:seed      # opcional, para cargar datos iniciales
npm run build
npm run dev
```

El servidor queda disponible en `http://localhost:3000`.

## Endpoints disponibles

### Generales

- `GET /`
- `GET /health`

### Members

- `GET /api/members`
- `GET /api/members/with-membership`
- `GET /api/members/:id`
- `POST /api/members`
- `PATCH /api/members/:id`
- `DELETE /api/members/:id`

### Memberships

- `GET /api/memberships`
- `GET /api/memberships/member/:memberId`
- `GET /api/memberships/:id`
- `POST /api/memberships`
- `PATCH /api/memberships/:id`
- `DELETE /api/memberships/:id`
- `GET /api/memberships/:membershipId/payments`
- `POST /api/memberships/:membershipId/payments`

### Membership plans

- `GET /api/membership-plans`
- `GET /api/membership-plans/:id`
- `POST /api/membership-plans`
- `PATCH /api/membership-plans/:id`
- `DELETE /api/membership-plans/:id`

### Payments

- `GET /api/payments`
- `GET /api/payments/:id`
- `POST /api/payments`
- `PATCH /api/payments/:id`
- `DELETE /api/payments/:id`

### Instructors

- `GET /api/instructors`
- `GET /api/instructors/:id`
- `POST /api/instructors`
- `PUT /api/instructors/:id`
- `DELETE /api/instructors/:id`

### Exercises

- `GET /api/exercises`
- `GET /api/exercises/:id`
- `POST /api/exercises`
- `PATCH /api/exercises/:id`
- `DELETE /api/exercises/:id`

### Routines

- `GET /api/routines`
- `GET /api/routines/:id`
- `POST /api/routines`
- `PATCH /api/routines/:id`
- `DELETE /api/routines/:id`

### Routine exercises

- `GET /api/routineExercise`
- `GET /api/routineExercise/:id`
- `GET /api/routineExercise/routine/:routineId`
- `POST /api/routineExercise`
- `PATCH /api/routineExercise/:id`
- `DELETE /api/routineExercise/:id`

### Class schedules

- `GET /api/classSchedules`
- `GET /api/classSchedules/:id`
- `GET /api/classSchedules/category/:category`
- `POST /api/classSchedules`
- `PUT /api/classSchedules/:id`
- `DELETE /api/classSchedules/:id`

### Class sessions

- `GET /api/classSessions`
- `GET /api/classSessions/:id`
- `GET /api/classSessions/instructor/:instructorId`
- `GET /api/classSessions/schedule/:classScheduleId`
- `POST /api/classSessions`
- `PUT /api/classSessions/:id`
- `DELETE /api/classSessions/:id`

### Class bookings

- `GET /api/classBookings`
- `GET /api/classBookings/:id`
- `POST /api/classBookings`
- `PATCH /api/classBookings/:id`
- `DELETE /api/classBookings/:id`

## Sugerencias y cuestiones a revisar

- Finalizar la migración del módulo `instructor` al nuevo patrón de arquitectura (`controller` + `validate.middleware` + `errorHandler.middleware`), ya que actualmente mantiene el esquema anterior con try/catch directo y `handleError`.
- Unificar o documentar la estrategia de variables de entorno entre Prisma CLI (`DATABASE_URL` en `prisma.config.ts`) y la conexión en tiempo de ejecución (`DATABASE_*` con `@prisma/adapter-mariadb`).
- Agregar pruebas automatizadas (unitarias y de integración) para complementar las solicitudes manuales de los archivos `.http` en `test/`.
- Incorporar mecanismos de autenticación y autorización en los endpoints según los roles requeridos (ej. socios, instructores, administradores).
