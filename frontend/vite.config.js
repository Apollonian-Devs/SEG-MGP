import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/static/',
  build: {
    outDir: '../backend/static',
    assetsDir: 'assets',
    manifest: true,  // Generate manifest.json
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        entryFileNames: 'assets/[name]-[hash].js',
      }
    }
  },
  server: {
    proxy: {
      '/api': 'https://seg-mgp.onrender.com'
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
