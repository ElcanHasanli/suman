import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://194.163.173.179:9090',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''), // /api/users/login -> /users/login
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Original request:', req.method, req.url);
            console.log('Proxied to:', proxyReq.path);
            console.log('Target URL:', `http://194.163.173.179:9090${proxyReq.path}`);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Response from backend:', proxyRes.statusCode, req.url);
          });
        },
      }
    }
  }
})
