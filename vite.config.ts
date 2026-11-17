import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
	server: {
		host: '0.0.0.0', // 외부 IP 접근 허용
		port: 5173, // 포트 번호 (필요 시 변경 가능)
		// 로컬: 브라우저 → 같은 출처 `/mukburim` → Vite가 cal.carenation.kr 로 프록시 (CORS 회피)
		proxy: {
			'/mukburim': {
				target: 'https://cal.carenation.kr',
				changeOrigin: true,
				secure: true,
			},
		},
	},
	plugins: [react()],
	build: {
		outDir: 'dist',
	},
})
