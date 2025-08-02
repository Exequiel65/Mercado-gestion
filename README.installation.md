# 🚀 Instalación y ejecución de Mercado Gestión (Komanda Shop)

Este proyecto incluye una plataforma de gestión de e-commerce multi-tenant desarrollada en .NET, React, y tecnologías modernas. A continuación, te mostramos cómo levantar el proyecto completo utilizando Docker.

---

## 📦 Opción 1: Instalación rápida con Docker Compose

Esta es la forma más simple de levantar el entorno completo con todos los servicios necesarios.

### ✅ Requisitos previos

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### 🔧 Servicios incluidos

- **SQL Server 2022** como base de datos principal.
- **MinIO** para almacenamiento de imágenes/archivos.
- **Backend API (.NET 8)** con arquitectura hexagonal.
- **Frontend Web (React 19 + Vite)** como panel de administración.
- **API Gateway (NestJS)** como orquestador de rutas públicas.

### 📂 Estructura esperada

```bash
root/
│
├── docker-compose.yml
├── api-admin-mercado-gestion/         # Backend .NET
├── admin/                             # Frontend Admin (React + Vite)
├── api-web/                           # Backend .Nest js
├── client/                           # Frontend Publico (tienda online) - (React + vite + ssr)
└── ...
```

# 🚀 Levantar los servicios

Desde la raíz del proyecto (donde está el `docker-compose.yml`), ejecutá:

```bash
docker compose up --build
```

Esto construirá y levantará todos los contenedores: base de datos, almacenamiento, API, frontend admin y tienda pública.

> 🧠 El primer build puede tardar algunos minutos dependiendo de tu red y potencia de máquina.

## 🛠️ Comandos útiles

### 🔄 Levantar en segundo plano:

```bash
docker compose up -d
```

### ❌ Detener todos los servicios:

```bash
docker compose down
```

### 🔍 Ver logs de un servicio (por ejemplo, la API):

```bash
docker compose logs -f api
```

### 🧹 Eliminar contenedores y volúmenes (¡borra datos!):

```bash
docker compose down -v
```

## 🌐 Acceso a la aplicación

- **Frontend Admin:** http://localhost:3000
- **Frontend Público (tienda):** http://localhost:5173
- **API Gateway (NestJS):** http://localhost:8082
- **MinIO Console:** http://localhost:9001
  - Usuario: `minioadmin`
  - Contraseña: `minioadmin`

## ⚠️ Notas importantes

- Las credenciales por defecto (`sa`, `minioadmin`) **no son seguras** para producción. Cambialas antes de hacer deploy.
- Si usás otro puerto o cambiás alguna configuración, recordá actualizar los `.env` o archivos de entorno asociados.
- El frontend está configurado para consumir la API desde `http://localhost:8082`. Modificá `VITE_API_URL` si lo cambiás.

## 📁 Ejecutar proyectos por separado

Si querés trabajar solo con un proyecto individual (por ejemplo, el backend o el panel admin), podés levantarlo por separado. Consultá el `README.md` de cada subcarpeta para más instrucciones:

- `api-admin-mercado-gestion/README.md`
- `admin/README.md`
- `api-web/README.md`
- `client/README.md`

## 🧪 Entorno de desarrollo

Para desarrollo local sin Docker, se puede levantar cada proyecto manualmente. Esta opción es útil para debugging, pruebas o desarrollo de nuevas features. Ver instrucciones específicas en cada módulo.