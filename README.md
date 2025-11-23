# Frontend - Microservices Ecommerce

Frontend React para el proyecto de microservicios ecommerce.

## 🚀 Inicio Rápido

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Build para Producción

```bash
npm run build
```

Los archivos estáticos se generarán en la carpeta `dist/`

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/      # Componentes reutilizables
│   ├── pages/          # Páginas principales
│   ├── context/        # Context API (Auth, Cart)
│   ├── services/       # Servicios API
│   └── utils/          # Utilidades
├── public/             # Archivos estáticos
└── dist/               # Build de producción
```

## 🔧 Configuración

### Desarrollo Local

El frontend detecta automáticamente el entorno:

1. **Si el proxy-client está corriendo localmente** (puerto 8900):
   - Usa automáticamente: `http://localhost:8900`
   - O crea `.env.development` con: `VITE_API_URL=http://localhost:8900`

2. **Si quieres usar la API desplegada en desarrollo**:
   - Crea `.env.development` con: `VITE_API_URL=https://api.santiesleo.dev`

### Producción

El frontend detecta automáticamente si está en `app.santiesleo.dev` y usa:
- `https://api.santiesleo.dev`

O crea `.env.production` con:
```
VITE_API_URL=https://api.santiesleo.dev
```

### Detección Automática

El frontend detecta automáticamente:
- ✅ Si estás en `app.santiesleo.dev` → usa `https://api.santiesleo.dev`
- ✅ Si estás en `localhost` → usa `http://localhost:8900`
- ✅ Puedes sobrescribir con variables de entorno

## 📦 Tecnologías

- React 18
- React Router DOM
- Axios
- Bootstrap 5
- React Bootstrap
- Vite

## 🎯 Funcionalidades

- ✅ Autenticación (Login/Registro)
- ✅ Lista de productos
- ✅ Detalle de producto
- ✅ Carrito de compras
- ✅ Checkout
- ✅ Perfil de usuario
- ✅ Gestión de órdenes

