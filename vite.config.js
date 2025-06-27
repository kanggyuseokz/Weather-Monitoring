// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 기상청 API (날씨, 태풍) 프록시
      '/kma-api': {
        target: 'http://apis.data.go.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/kma-api/, ''),
        secure: false,
      },
      // 한국환경공단 API (미세먼지) 프록시
      '/airkorea-api': {
        target: 'http://apis.data.go.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/airkorea-api/, ''),
        secure: false,
      },
    },
  },
});
