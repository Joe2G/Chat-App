import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/socket.io': {
        target: 'https://chat-app-indol-tau.vercel.app',
        changeOrigin: true,
        ws: true,
      },
      '/api': {
        target: 'https://chat-app-indol-tau.vercel.app',
        changeOrigin: true,
      },
    },
  },
});