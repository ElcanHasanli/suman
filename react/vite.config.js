import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Proxy ləğv edildi — birbaşa backend URL istifadə olunacaq
  define: {
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify('http://62.171.154.6:9090')
  }
})
