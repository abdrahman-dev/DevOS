import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    sourcemap: false,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) return 'react';
          if (id.includes('node_modules/react-router')) return 'router';
          if (id.includes('node_modules/framer-motion')) return 'motion';
          if (id.includes('node_modules/zustand')) return 'zustand';
          if (id.includes('node_modules/lucide-react')) return 'ui';
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'zustand', 'idb'],
  },
});
