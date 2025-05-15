import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, 'public'), // Chỉ định thư mục chứa index.html
  publicDir: path.resolve(__dirname, 'public'), // Chỉ định thư mục public
  server: {
    open: true, // Tự động mở trình duyệt khi server khởi động
    port: 5173, // Đảm bảo cổng là 5173
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'), // Thư mục build
    emptyOutDir: true,
  },
  resolve: {
    alias: [
      { find: '/src', replacement: path.resolve(__dirname, 'src') },
    ],
  },
})
