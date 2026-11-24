import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8001';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': BACKEND_URL,
      '/cuentas': BACKEND_URL,
      '/static': BACKEND_URL,
    },
  },
});
