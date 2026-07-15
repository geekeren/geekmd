import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(rootDir, 'src'),
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      input: {
        index: resolve(rootDir, 'index.html'),
        auth: resolve(rootDir, 'auth/index.html'),
      },
    },
  },
});
