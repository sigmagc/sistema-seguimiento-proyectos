# Sistema de Seguimiento de Proyectos

Sistema integral de gestión y seguimiento de proyectos con control de usuarios y flujos de aprobación.

## Características

- 🔐 **Sistema de Autenticación**: Control de acceso por roles
- 👥 **Gestión de Usuarios**: Administración completa de usuarios del sistema
- 📊 **Dashboard Interactivo**: Visualización de métricas y progreso
- ✅ **Flujo de Aprobaciones**: Sistema de aprobaciones para proyectos, hitos y presupuestos
- 📈 **Reportes y Gráficos**: Curvas S y métricas de avance
- 🎯 **Gestión de Proyectos**: Creación y seguimiento completo

## Roles de Usuario

### Administrador
- Gestión completa de usuarios
- Aprobación de proyectos, hitos y presupuestos
- Acceso total al sistema

### Gestor de Seguimiento
- Aprobación de proyectos, hitos y presupuestos
- Visualización de todos los proyectos
- Sin gestión de usuarios

### Project Manager
- Creación y edición de proyectos
- Gestión de hitos y presupuestos
- Solo visualiza sus propios proyectos

## Usuarios de Prueba

- **Administrador**: `admin` / `admin123`
- **Gestor Seguimiento**: `gestor1` / `gestor123`
- **Project Manager**: `pm1` / `pm123`

## Instalación y Uso

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Servir en producción
npm start

## Configuración de Supabase

1. Crea un proyecto en [Supabase](https://supabase.com) y copia la URL y la clave anónima en `src/supabaseClient.js`.
2. En el panel de SQL ejecuta el siguiente script para crear las tablas básicas:

```sql
create table users (
  id uuid primary key default uuid_generate_v4(),
  username text unique not null,
  password text not null,
  name text not null,
  email text unique not null,
  role text not null,
  status text default 'activo',
  created_at timestamp with time zone default now(),
  created_by uuid
);

create table projects (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  status text,
  created_by uuid references users(id),
  approved_by uuid,
  needs_approval boolean default false,
  charter jsonb,
  milestones jsonb,
  monthly_budget jsonb,
  overall_progress integer default 0,
  created_at timestamp with time zone default now()
);
```

Estas tablas almacenan la información utilizada por la aplicación para usuarios y proyectos.
