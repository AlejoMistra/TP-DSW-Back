# Backend - Sistema de gestión de gimnasio

API REST para administrar socios, instructores, ejercicios, horarios de clase y planes de membresía.

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

- `router`: define endpoints HTTP y delega el trabajo
- `service`: concentra reglas de negocio y validaciones de flujo
- `repository`: encapsula el acceso a datos
- `schemas`: valida entradas con Zod
- `entity`: define tipos y entidades del dominio

Además, hoy se observan estos patrones de soporte:

- `src/shared/instances.ts`: composición manual de dependencias
- `src/lib/prisma.ts`: instancia compartida de Prisma
- `src/utils/errorHandler.ts`: manejo centralizado de errores HTTP

## Estructura principal

```text
src/
├── app.ts
├── server.ts
├── lib/
│   └── prisma.ts
├── shared/
│   └── instances.ts
├── utils/
│   └── errorHandler.ts
└── modules/
    ├── member/
    ├── instructor/
    ├── exercise/
    ├── classSchedule/
    └── membershipPlan/
```

## Instalación y ejecución

### Requisitos

- Node.js 18 o superior
- npm
- Base de datos MariaDB/MySQL disponible

### Variables de entorno

Crear un archivo `.env` en la raíz con, como mínimo:

```env
PORT=3000
DATABASE_URL=<mysql-connection-string>
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=user
DATABASE_PASSWORD=password
DATABASE_NAME=database
```

### Scripts

- `npm run dev`: compila en modo watch y levanta el servidor
- `npm run build`: compila TypeScript

### Puesta en marcha

```bash
npm install
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
- `GET /api/members/:id`
- `POST /api/members`
- `PUT /api/members/:id`
- `DELETE /api/members/:id`

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
- `PUT /api/exercises/:id`
- `DELETE /api/exercises/:id`

### Class schedules

- `GET /api/classSchedules`
- `GET /api/classSchedules/:id`
- `GET /api/classSchedules/instructor/:instructorId`
- `GET /api/classSchedules/category/:category`
- `GET /api/classSchedules/day/:dayOfWeek`
- `POST /api/classSchedules`
- `PUT /api/classSchedules/:id`
- `DELETE /api/classSchedules/:id`

### Membership plans

- `GET /api/membership-plans`
- `GET /api/membership-plans/:id`
- `POST /api/membership-plans`
- `PUT /api/membership-plans/:id`
- `DELETE /api/membership-plans/:id`

## Sugerencias y cuestiones a revisar

- Hay modelos en Prisma que todavía no tienen endpoints expuestos, como membresías, sesiones de clase y reservas.
- Conviene unificar la estrategia de variables de entorno entre Prisma CLI (`DATABASE_URL`) y la conexión usada por la app.
- Sería útil agregar tests automatizados para complementar los archivos `.http` del directorio `test/`.
