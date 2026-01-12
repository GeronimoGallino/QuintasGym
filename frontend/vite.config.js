import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // <--- ESTA LÍNEA ES LA CLAVE: Permite acceso desde la red (celular)
    port: 5173, // Fijamos el puerto para que no cambie
  }
})