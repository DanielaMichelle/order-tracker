# 🧾 Orders App
Este es un proyecto de gestión de órdenes que permite crear, editar y eliminar pedidos junto con sus productos. Está dividido en dos partes: un backend desarrollado con **Node.js, Express y Prisma**, y un frontend construido con **Next.js** y **TailwindCSS**.

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
# Ir al directorio del backend
cd orders-app-backend

# Instalar dependencias
npm install

# Configuración del Entorno (.env)
Crea un archivo ".env" en la raíz del proyecto y configura las variables de entorno para la conexión a la base de datos PostgreSQL
   ```bash
   PORT=
   POSTGRES_USER="name"
   POSTGRES_PASSWORD="password"
   POSTGRES_DB="database_name"
   DATABASE_URL="postgresql://name:password@localhost:5432/database_name
   ```

# Contruye y despliega el contenedor con docker compose
docker-compose up -d

# Ejecutar migraciones de Prisma
npx prisma migrate dev

# Llenar la base de datos con data inicial
npx prisma db seed

# Ejecutar proyecto
npm run dev

El backend se ejecutará en http://localhost:3000 (o el puerto que definas en tu .env).


### 🧩 1. FRONTEND
# Ir al directorio del frontend
cd orders-app-frontend

# Instalar dependencias
npm install

# Agregar ruta base del backend al frontend
En el archivo orders-app-frontend/services/api.js
Ejemplo: const API_BASE = 'http://localhost:3000/api';

# Ejecutar la app
npm run dev