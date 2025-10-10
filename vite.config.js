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
        target: ' https://onehealthconnekt.onrender.com',
        changeOrigin: true,
      }
    }
  }
})