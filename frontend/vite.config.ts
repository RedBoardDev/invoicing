import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'node:path';

export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    port: 3002,
    open: true,
  },
  resolve: {
    alias: {
      '@icon': path.resolve(__dirname, 'src/components/Icon.tsx'),
      '@icons': path.resolve(__dirname, 'src/assets/icons'),
      '@images': path.resolve(__dirname, 'src/assets/images'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@enums': path.resolve(__dirname, 'src/enums'),
      '@api': path.resolve(__dirname, 'src/services/api'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@contexts': path.resolve(__dirname, 'src/contexts'),
      '@utils': path.resolve(__dirname, 'src/utils/index.ts'),
      '@interfaces': path.resolve(__dirname, 'src/interfaces'),
      '@views': path.resolve(__dirname, 'src/views'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@config': path.resolve(__dirname, 'src/config'),
      '@routes': path.resolve(__dirname, 'src/routes'),
    },
  },
  build: {
    outDir: 'build',
  },
});
