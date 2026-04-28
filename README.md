# genoma_challenge_frontend

Interfaz web construida con React y Ant Design para la gestión de restaurantes. Consume la API de [genoma_challenge_backend](https://github.com/pablofroilan/genoma_challenge_backend).

## Tecnologías

- React 19 (Vite + TypeScript)
- Ant Design

## Requisitos

- Node.js 18 o superior
- genoma_challenge_backend corriendo en `http://localhost:8000`

## Instalación

1. Clona el repositorio

```bash
git clone https://github.com/pablofroilan/genoma_challenge_frontend.git
cd genoma_challenge_frontend
```

2. Instala las dependencias

```bash
npm install
```

3. Inicia el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

## Funcionalidades

- Listado de restaurantes con paginación
- Filtro por tipo de cocina (filtro backend)
- Filtro por País y por Visita
- Ordenamiento por columnas
- Crear (a través de un modal), editar (a través de un modal) y eliminar restaurantes

## Estructura del proyecto

```
genoma_challenge_frontend/
├── src/
│   ├── components/
│   │   ├── RestaurantTable.tsx
│   │   ├── RestaurantEditModal.tsx
│   │   └── RestaurantAddModal.tsx
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
├── index.html
└── package.json
```

## Configuración del proxy

El archivo `vite.config.ts` incluye un proxy para redirigir las llamadas a la API al backend durante el desarrollo:

```ts
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8000'
    }
  }
})
```
