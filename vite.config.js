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
        target: ' http://jk4k84k0so8g4ggg4oow4kcs.69.62.122.202.sslip.io',
        changeOrigin: true,
      }
    }
  }
})