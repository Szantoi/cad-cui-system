import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/index.js',
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
    setupFiles: ['./test/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/index.js']
    }
  }
});
