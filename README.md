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

Además, se observan estos patrones de soporte:

- `src/middlewares/validate.middleware.ts`: middleware genérico para validación de requests (body, params, query) con esquemas Zod, inyectando el resultado en `req.validated`.
- `src/middlewares/errorHandler.middleware.ts`: middleware centralizado de Express para manejo uniforme de errores (`ZodError`, `AppError`, errores de Prisma y errores no controlados), respondiendo con el formato estándar `{ statusCode, code, message, details? }`.
- `src/utils/errors.ts`: jerarquía de errores personalizados de aplicación (`AppError`, `NotFoundError`, `ConflictError`, `UnauthorizedError`, `BadRequestError`).
- `src/shared/instances.ts`: composición e inyección manual de dependencias (instanciación de repositorios, servicios y controladores).
- `src/lib/prisma.ts`: instancia compartida de Prisma Client configurada con `@prisma/adapter-mariadb`.


## Estructura principal

```text
.
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   ├── seed.ts
│   └── zod-generator.config.json
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── generated/
│   │   ├── prisma/
│   │   └── zod/
│   ├── lib/
│   │   └── prisma.ts
│   ├── middlewares/
│   │   ├── authentication.middleware.ts
│   │   ├── authorization.middleware.ts
│   │   ├── errorHandler.middleware.ts
│   │   └── validate.middleware.ts
│   ├── modules/
│   │   ├── auth/
│   │   ├── classBooking/
│   │   ├── classSchedule/
│   │   ├── classSession/
│   │   ├── exercise/
│   │   ├── instructor/
│   │   ├── member/
│   │   ├── membership/
│   │   ├── membershipPlan/
│   │   ├── payment/
│   │   ├── routine/
│   │   ├── routineExercise/
│   │   └── user/
│   ├── shared/
│   │   ├── common.schemas.ts
│   │   ├── constants.ts
│   │   └── instances.ts
│   └── utils/
│       ├── errors.ts
│       ├── errorHandler.ts
│       ├── stringUtils.ts
│       └── timeUtils.ts
├── test/
│   ├── *.http
│   ├── helpers/
│   │   └── auth.helper.ts
│   ├── integration/
│   │   ├── auth.integration.test.ts
│   │   └── authorization.integration.test.ts
│   └── mocks/
│       └── prisma.mock.ts
├── .gitignore
├── .env.example
├── README.md
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── prisma.config.ts
├── tsconfig.json
└── vitest.config.ts
```

`src/generated/prisma` y `src/generated/zod` se generan con `pnpm db:generate`.

Cada módulo implementa:
- `[dominio].routes.ts`: definición de rutas y middlewares de validación
- `[dominio].controller.ts`: controladores HTTP
- `[dominio].service.ts`: lógica de negocio
- `[dominio].repository.ts`: acceso a datos con Prisma
- `[dominio].schemas.ts`: esquemas de validación Zod

## Instalación y ejecución

### Requisitos

- Node.js 20.19 o superior
- pnpm
- Base de datos MariaDB/MySQL disponible

### Variables de entorno

Copiar `.env.example` como `.env` en la raíz y ajustar las credenciales para la instancia local de MariaDB/MySQL. La base de datos indicada (`tp_dsw` por defecto) debe existir. `DATABASE_URL` es utilizada por la CLI de Prisma (`prisma.config.ts`), mientras que las variables `DATABASE_*` individuales son consumidas en tiempo de ejecución por el adaptador `@prisma/adapter-mariadb`.

`JWT_SECRET` tiene un valor de desarrollo en la plantilla; configurar uno propio antes de usar el proyecto fuera de un entorno local.

### Scripts

- `pnpm dev`: compila en modo watch y levanta el servidor
- `pnpm build`: compila el proyecto TypeScript
- `pnpm db:migrate`: aplica o genera migraciones de base de datos con Prisma
- `pnpm db:generate`: genera el cliente de Prisma y esquemas de validación Zod
- `pnpm db:seed`: ejecuta el seeder para poblar datos iniciales
- `pnpm test`: ejecuta todos los tests una vez
- `pnpm test:watch`: ejecuta Vitest en modo interactivo/watch
- `pnpm test:unit`: ejecuta los tests unitarios ubicados en `src/modules/auth` y `src/modules/user`
- `pnpm test:integration`: ejecuta los tests de integración ubicados en `test/integration`
- `pnpm test:coverage`: ejecuta todos los tests y genera el reporte de cobertura

### Puesta en marcha

```bash
cp .env.example .env
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm build
pnpm dev
```

El servidor queda disponible en `http://localhost:3000`.

El seeder crea e inicializa users para los tres roles:

| Rol | Email | Contraseña |
| --- | --- | --- |
| Administrador | `admin@gym.com` | `admin1234` |
| Instructor | `gabrielmartinez@gmail.com` | `instructor1234` |
| Socio | `juan.perez@example.com` | `member1234` |

Volver a ejecutar `pnpm db:seed` restablece estas credenciales.

## Endpoints disponibles (Falta cambiar algunos PUT por PATCH)

### Generales

- `GET /`
- `GET /health`

### Auth

- `POST /api/auth/login`
- `POST /api/auth/activate-account`

### Users

- `GET /api/users`
- `GET /api/users/:id`
- `POST /api/users`
- `PATCH /api/users/:id`
- `DELETE /api/users/:id`

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
- `PATCH /api/instructors/:id`
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
- `PUT /api/classBookings/:id`
- `DELETE /api/classBookings/:id`

