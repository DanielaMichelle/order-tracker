# 🧾 Orders App
Este es un proyecto de gestión de órdenes que permite crear, editar y eliminar pedidos junto con sus productos. Está dividido en dos partes: un backend desarrollado con **Node.js, Express y Prisma**, y un frontend construido con **React.js** y **TailwindCSS**.

## 🚀 Funcionalidades
- Crear órdenes con múltiples productos
- Editar y eliminar órdenes
- Agregar, editar o eliminar productos dentro de una orden
- Cálculo automático del total y número de productos
- Interfaz moderna con TailwindCSS

## 📁 Estructura del Proyecto
orders-app/
├── orders-app-backend/ # Backend (Node.js, Express, Prisma)
└── orders-app-frontend/ # Frontend (Next.js + TailwindCSS)

## 📦 Cómo ejecutar el proyecto

Primero, clona el repositorio del proyecto en tu máquina local

### 🧩 1. BACKEND
**Ir al directorio del backend**
```bash
cd orders-app-backend
```

**Instalar dependencias**
```bash
npm install
```

**Configuración del Entorno (.env)**
Crea un archivo ".env" en la raíz del proyecto y configura las variables de entorno para la conexión a la base de datos PostgreSQL
   ```bash
   PORT=
   POSTGRES_USER="name"
   POSTGRES_PASSWORD="password"
   POSTGRES_DB="database_name"
   DATABASE_URL="postgresql://name:password@localhost:5432/database_name
   ```

**Contruye y despliega el contenedor con docker compose**
```bash
docker-compose up -d
```

**Ejecutar migraciones de Prisma**
```bash
npx prisma migrate dev
```

**Llenar la base de datos con data inicial**
```bash
npx prisma db seed
```

**Ejecutar proyecto**
```bash
node src/index.js
```

El backend se ejecutará en http://localhost:3000 (o el puerto que definas en tu .env).


### 🧩 1. FRONTEND
**Ir al directorio del frontend**
```bash
cd orders-app-frontend
```

**Instalar dependencias**
```bash
npm install
```

**Agregar ruta base del backend al frontend**
En el archivo orders-app-frontend/services/api.js y agrega la ruta base del backend a la variable API_BASE.

**Ejecutar la app**
```bash
npm run dev
```
