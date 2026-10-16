# Primer Parcial – Sistema de Gestión de Proyectos de Software

API REST con Node.js, Express y Sequelize/MySQL.

## Requisitos

- Node.js 18 o superior
- MySQL 8

## Instalación y configuración

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/<usuario>/solucion-primer-parcial-tlp2-ibars-eluney.git
   cd solucion-primer-parcial-tlp2-ibars-eluney
   ```
2. Instalar las dependencias:
   ```bash
   npm install
   ```
3. Copiar `.env.example` a `.env` y completar los valores:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=gestion_proyectos
   DB_USER=root
   DB_PASSWORD=
   JWT_SECRET=secreto
   ```
4. Crear la base de datos en MySQL:
   ```sql
   CREATE DATABASE gestion_proyectos;
   ```
5. Iniciar el servidor:
   ```bash
   npm run dev
   ```
   Las tablas se crean automáticamente al iniciar (`sequelize.sync()`).

## Autenticación

Al iniciar sesión se guarda el JWT en una cookie `httpOnly` llamada `token`, que se envía automáticamente en las siguientes peticiones. El token expira en 1 hora. Al cerrar sesión la cookie se elimina.

## Endpoints

| Método | Ruta                       | Acceso            |
| ------ | -------------------------- | ----------------- |
| POST   | `/api/auth/register`       | Público           |
| POST   | `/api/auth/login`          | Público           |
| POST   | `/api/auth/logout`         | Sesión iniciada   |
| GET    | `/api/users`               | administrator     |
| DELETE | `/api/users/:id`           | administrator     |
| POST   | `/api/technologies`        | administrator     |
| GET    | `/api/technologies`        | Sesión iniciada   |
| DELETE | `/api/technologies/:id`    | administrator     |
| POST   | `/api/projects`            | Sesión iniciada   |
| GET    | `/api/projects`            | administrator     |
| GET    | `/api/projects/my-projects`| Sesión iniciada   |
| PUT    | `/api/projects/:id`        | Líder del proyecto|
| DELETE | `/api/projects/:id`        | Líder del proyecto|

## Ejemplos de body

### Registro

```json
{
  "username": "eluney1",
  "email": "eluney@mail.com",
  "password": "Password123",
  "role": "developer",
  "profile": {
    "employee_number": "EMP-0001",
    "first_name": "Eluney",
    "last_name": "Ibars",
    "phone": "+5493704123456"
  }
}
```

### Login

```json
{
  "email": "eluney@mail.com",
  "password": "Password123"
}
```

### Crear proyecto

```json
{
  "code": "PRJ-001",
  "name": "Sistema de ventas",
  "description": "Proyecto de gestión de ventas",
  "status": "planning",
  "start_date": "2026-10-16",
  "budget": 150000.5,
  "technologies": [1, 2]
}
```

## Formatos y reglas de validación

- `username`: 3 a 20 caracteres alfanuméricos, único.
- `email`: formato válido, único.
- `password`: mínimo 8 caracteres, con al menos una mayúscula, una minúscula y un número.
- `role`: `developer` o `administrator` (por defecto `developer`).
- `profile.employee_number`: formato `EMP-0000`, único.
- `profile.first_name` y `profile.last_name`: 2 a 50 caracteres, solo letras.
- `profile.phone`: opcional, de 7 a 15 dígitos con `+` opcional.
- `code`: formato `AAA-000` (tres letras mayúsculas, guion y tres dígitos), único.
- `name`: 3 a 100 caracteres.
- `description`: 10 a 500 caracteres.
- `status`: `planning`, `in_progress`, `paused` o `finished` (por defecto `planning`).
- `start_date`: fecha válida con formato `YYYY-MM-DD`.
- `budget`: número positivo.
- `leader_id`: opcional, debe corresponder a un usuario activo. Al crear un proyecto, el líder es el usuario autenticado.
- `technologies`: array de ids de technologies existentes.

## Relaciones

- **1:1** User ↔ Profile (`profile` / `user`).
- **1:N** User ↔ Project (`projects` / `leader`), con la FK `leader_id`.
- **N:M** Project ↔ Technology (`technologies` / `projects`), a través de `ProjectTechnology`.

Los usuarios usan eliminación lógica (`paranoid`). Al eliminar un proyecto o una technology, se eliminan en cascada sus registros en `ProjectTechnology`.
