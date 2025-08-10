import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    laravel({
      input: [
        'resources/css/app.css',
        'resources/js/app.jsx',
      ],
      refresh: true,
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@': '/resources/js',
      '@components': '/resources/js/Components',
      '@pages': '/resources/js/Pages',
      '@layouts': '/resources/js/Layouts',
      '@utils': '/resources/js/Utils',
      '@hooks': '/resources/js/Hooks',
      '@constants': '/resources/js/Constants',
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    hmr: {
      host: '127.0.0.1',
    },
  },
});
