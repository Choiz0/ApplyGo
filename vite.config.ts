import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.VITE_PORT) || 3000, // VITE_PORT 환경 변수를 사용, 기본값은 3000
  }
},

)
