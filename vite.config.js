import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 8080,
    proxy: {
      '': {
        target: ' http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})