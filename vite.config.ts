import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    host: true,
    port: 5174, // optional, default dev port
  },
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'src/lib/errors.ts',
        'src/lib/permissions.ts',
        'src/lib/playerStats.ts',
        'src/lib/util.ts',
      ],
    },
  },
  build: {
    outDir: 'dist', // Netlify expects the build folder
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          const normalizedId = id.replaceAll('\\', '/');

          if (
            normalizedId.includes('/node_modules/react/') ||
            normalizedId.includes('/node_modules/react-dom/') ||
            normalizedId.includes('/node_modules/scheduler/')
          ) {
            return 'react-vendor';
          }

          if (
            normalizedId.includes('/node_modules/react-router/') ||
            normalizedId.includes('/node_modules/react-router-dom/') ||
            normalizedId.includes('/node_modules/@remix-run/router/')
          ) {
            return 'router-vendor';
          }

          if (normalizedId.includes('/node_modules/@supabase/')) {
            return 'supabase-vendor';
          }

          if (
            normalizedId.includes('/node_modules/react-icons/') ||
            normalizedId.includes('/node_modules/lucide-react/')
          ) {
            return 'icons-vendor';
          }

          if (normalizedId.includes('/node_modules/@chakra-ui/')) {
            return 'chakra-vendor';
          }

          if (normalizedId.includes('/node_modules/@emotion/')) {
            return 'emotion-vendor';
          }

          if (
            normalizedId.includes('/node_modules/@ark-ui/') ||
            normalizedId.includes('/node_modules/@zag-js/')
          ) {
            return 'ark-vendor';
          }

          if (normalizedId.includes('/node_modules/framer-motion/')) {
            return 'motion-vendor';
          }

          return 'vendor';
        },
      },
    },
  },
});
