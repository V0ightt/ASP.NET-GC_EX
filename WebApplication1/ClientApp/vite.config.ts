import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            // redirect any call starting /api to the ASP.NET dev server
            '/api': {
                target: 'http://localhost:5044',   // or 7069 depending on launch profile
                changeOrigin: true,
                secure: false
            }
        }
    },
    build: {
        outDir: '../wwwroot',   // puts final files straight into ASP.NET wwwroot
        emptyOutDir: true
    }
})
