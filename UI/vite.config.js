import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Only use this if you need a proxy for WebSocket connections
      '/socket.io': {
        target: 'https://chat-app-khaki-zeta.vercel.app',
        changeOrigin: true,
        ws: true,
      },
    },
  },
});