/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_BOBMUKZA_LOGIN_CODE?: string
	readonly VITE_MUKBURIM_API_BASE?: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
