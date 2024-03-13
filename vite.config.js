import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Personalize a porta do servidor
    open: true, // Abra o navegador automaticamente ao iniciar o servidor
  },
})
