import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    proxy: {
      '/api': 'https://apolloniandevs.onrender.com'
    },
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
