// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     react(),tailwindcss(),
//   ],
// })



import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Add this server configuration
  server: {
    proxy: {
      // This forwards any request starting with /api to your backend
      '/api': {
        target: 'http://localhost:8000', // Your backend server address
        changeOrigin: true,
      },
    },
  },
})
