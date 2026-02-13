import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3504
  },
  build: {
    outDir: path.resolve(__dirname, '../backend/public'),
    emptyOutDir: true
  }
})
