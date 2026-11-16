/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_BOBMUKZA_LOGIN_CODE?: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
