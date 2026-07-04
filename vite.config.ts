import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    __APP_ENV__: JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  build: {
    chunkSizeWarningLimit: 1000,
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/react-router')) {
            return 'vendor';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'framer';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'icons';
          }
          if (id.includes('node_modules/@supabase') || id.includes('node_modules/firebase')) {
            return 'db';
          }
          if (id.includes('lib/ai') || id.includes('AIAssistant') || id.includes('FlashcardDeck')) {
            return 'ai';
          }
        },
      },
    },
  },
  server: {
    allowedHosts: ['localhost', '.edualttech.com'],
  },
});