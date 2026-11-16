const LOGGED_IN_KEY = 'bobmukzaLoggedIn'
const USER_NAME_KEY = 'bobmukzaUserName'
const MEMBER_ID_KEY = 'bobmukzaMemberId'

const PASSWORD_MIN = 8
const PASSWORD_MAX = 128

export const isBobmukzaLoggedIn = (): boolean =>
	localStorage.getItem(LOGGED_IN_KEY) === 'true'

export const getBobmukzaUserName = (): string =>
	localStorage.getItem(USER_NAME_KEY) ?? ''

export const getBobmukzaMemberId = (): number | null => {
	const raw = localStorage.getItem(MEMBER_ID_KEY)
	if (!raw) return null
	const n = Number(raw)
	return Number.isFinite(n) ? n : null
}

export const setBobmukzaSession = (userName: string, memberId?: number) => {
	const name = userName.trim()
	localStorage.setItem(LOGGED_IN_KEY, 'true')
	localStorage.setItem(USER_NAME_KEY, name)
	if (memberId != null) {
		localStorage.setItem(MEMBER_ID_KEY, String(memberId))
	}
}

export const clearBobmukzaSession = () => {
	localStorage.removeItem(LOGGED_IN_KEY)
	localStorage.removeItem(USER_NAME_KEY)
	localStorage.removeItem(MEMBER_ID_KEY)
}

export const validateBobmukzaSignupForm = (
	userName: string,
	password: string,
	passwordConfirm: string,
): { ok: true; name: string } | { ok: false; message: string } => {
	const name = userName.trim()
	const secret = password
	const secretConfirm = passwordConfirm

	if (!name) {
		return { ok: false, message: '이름을 입력해 주세요.' }
	}
	if (name.length < 2) {
		return { ok: false, message: '이름은 2글자 이상이에요.' }
	}
	if (!secret) {
		return { ok: false, message: '비밀번호를 입력해 주세요.' }
	}
	if (secret.length < PASSWORD_MIN) {
		return {
			ok: false,
			message: `비밀번호는 ${PASSWORD_MIN}자 이상이에요.`,
		}
	}
	if (secret.length > PASSWORD_MAX) {
		return {
			ok: false,
			message: `비밀번호는 ${PASSWORD_MAX}자 이하여야 해요.`,
		}
	}
	if (secret !== secretConfirm) {
		return { ok: false, message: '비밀번호 확인이 일치하지 않아요.' }
	}

	return { ok: true, name }
}

export const validateBobmukzaLoginForm = (
	userName: string,
	password: string,
): { ok: true; name: string } | { ok: false; message: string } => {
	const name = userName.trim()
	if (!name) {
		return { ok: false, message: '이름을 입력해 주세요.' }
	}
	if (!password) {
		return { ok: false, message: '비밀번호를 입력해 주세요.' }
	}
	return { ok: true, name }
}