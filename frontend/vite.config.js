import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/SEG-MGP',
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
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      },
    },
  },
});
