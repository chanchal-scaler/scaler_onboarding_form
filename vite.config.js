import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/mentee-onboarding/',
  plugins: [react()],
  preview: {
    allowedHosts: ['.up.railway.app', 'scaler.com', 'www.scaler.com'],
  },
})
