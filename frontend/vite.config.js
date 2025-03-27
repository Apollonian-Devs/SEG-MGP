import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/static/',
  server: {
    proxy: {
      '/api': 'https://seg-mgp.onrender.com'
    },
  },
  build: {
    outDir: '../backend/backend/static'
  },
  
  test: {
    globals: true,  
    environment: 'jsdom', 
    setupFiles: './setupTests.js', 
    include: ['src/__tests__/**/*.test.jsx'],
    coverage: {
      provider: 'v8', 
      reporter: ['text', 'html'], 
      exclude: [
        '*.config.js',
        'src/main.jsx',
      ],
    },
  },
});
