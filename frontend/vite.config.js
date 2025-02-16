import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
<<<<<<< HEAD
    environment: 'jsdom', 
  },
})
=======
    globals: true,  
    environment: 'jsdom', 
    setupFiles: './setupTests.js', 
    include: ['src/__tests__/**/*.test.jsx'], 
    coverage: {
      provider: 'v8', 
      reporter: ['text', 'html'], 
    },
  },
});
>>>>>>> origin/main
