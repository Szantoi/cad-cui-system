import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/entry.ts',
      formats: ['es'],
      fileName: 'index',
      cssFileName: 'styles'
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', 'react-router-dom']
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/index.ts', 'src/entry.ts', 'src/vite-env.d.ts']
    }
  }
});
