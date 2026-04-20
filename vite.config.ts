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
          if (!id.includes('node_modules')) {
            return;
          }

          if (
            id.includes('/node_modules/react/') ||
            id.includes('/node_modules/react-dom/') ||
            id.includes('/node_modules/scheduler/')
          ) {
            return 'react-vendor';
          }

          if (
            id.includes('/node_modules/react-router/') ||
            id.includes('/node_modules/react-router-dom/') ||
            id.includes('/node_modules/@remix-run/router/')
          ) {
            return 'router-vendor';
          }

          if (
            id.includes('/node_modules/@chakra-ui/') ||
            id.includes('/node_modules/@emotion/') ||
            id.includes('/node_modules/@ark-ui/') ||
            id.includes('/node_modules/@zag-js/')
          ) {
            return 'ui-vendor';
          }

          if (id.includes('/node_modules/react-icons/')) {
            return 'icons-vendor';
          }

          if (id.includes('/node_modules/@supabase/')) {
            return 'supabase-vendor';
          }

          return 'vendor';
        },
      },
    },
  },
});
