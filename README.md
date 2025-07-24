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

Antes de ejecutar el proyecto copia el archivo `.env.example` a `.env` y completa los valores de `REACT_APP_SUPABASE_URL` y `REACT_APP_SUPABASE_ANON_KEY`.
```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Servir en producción
npm start
```


## Licencia

Este proyecto se distribuye bajo la [Licencia MIT](LICENSE).
