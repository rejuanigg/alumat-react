import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Backend Django. Fuera de Docker es localhost:8001 (APP_PORT del backend).
// Dentro del contenedor del front se usa BACKEND_URL (ver docker-compose.yml).
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8001';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // El backend usa cookies de sesión y no tiene CORS: el navegador tiene
    // que ver front y API en el mismo origen. El proxy le cambia el Host al
    // del backend, así que el backend necesita en su .env:
    //   DJANGO_CSRF_TRUSTED_ORIGINS=http://localhost:5173
    // Sin eso, el login y los POST/PATCH responden "CSRF fallida".
    proxy: {
      '/api': BACKEND_URL,
      '/cuentas': BACKEND_URL,
      '/static': BACKEND_URL,
    },
  },
});
