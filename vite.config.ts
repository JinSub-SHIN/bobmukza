import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
	server: {
		host: '0.0.0.0', // 외부 IP 접근 허용
		port: 5173, // 포트 번호 (필요 시 변경 가능)
	},
	plugins: [react()],
})
