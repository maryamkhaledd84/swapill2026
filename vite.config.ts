import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(({mode}) => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: {
        port: 3000,
        host: 'localhost',
        protocol: 'ws',
        clientPort: 3000
      },
      watch: {
        usePolling: false,
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
  };
});
