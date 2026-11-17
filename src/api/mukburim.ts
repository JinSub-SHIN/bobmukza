import axios, { AxiosError, isAxiosError } from 'axios'

/** 배포: API 서버 직접 호출(CORS 허용 도메인). 개발: Vite 프록시 경로 */
export const MUKBURIM_API_BASE = import.meta.env.DEV
	? '/mukburim'
	: (import.meta.env.VITE_MUKBURIM_API_BASE ??
		'https://cal.carenation.kr/mukburim')

export const mukburimClient = axios.create({
	baseURL: MUKBURIM_API_BASE,
	headers: { 'Content-Type': 'application/json' },
	timeout: 20_000,
})

export type MemberAuthResponse = {
	member_id: number
	name: string
}

export type GowidUsageResponse = {
	name: string
	ym: string
	total_amount: number
	normal_amount: number
	misuse_amount: number
	tx_count: number
	last_loaded_at: string
}

export async function postMemberSignup(
	name: string,
	password: string,
): Promise<MemberAuthResponse> {
	const { data } = await mukburimClient.post<MemberAuthResponse>(
		'/api/members',
		{ name: name.trim(), password },
	)
	return data
}

export async function postMemberLogin(
	name: string,
	password: string,
): Promise<MemberAuthResponse> {
	const { data } = await mukburimClient.post<MemberAuthResponse>(
		'/api/login',
		{ name: name.trim(), password },
	)
	return data
}

export async function getGowidUsage(
	name: string,
	ym?: string,
): Promise<GowidUsageResponse> {
	const { data } = await mukburimClient.get<GowidUsageResponse>(
		'/api/gowid/usage',
		{
			params: {
				name: name.trim(),
				...(ym ? { ym } : {}),
			},
		},
	)
	return data
}

export function getMukburimErrorMessage(err: unknown): string {
	if (!isAxiosError(err)) {
		return '네트워크 오류가 났어요. 잠시 후 다시 시도해 주세요.'
	}

	const ax = err as AxiosError<{ detail?: string; message?: string }>
	const status = ax.response?.status
	const body = ax.response?.data
	const serverText =
		typeof body?.detail === 'string'
			? body.detail
			: typeof body?.message === 'string'
				? body.message
				: ''

	if (serverText) {
		return serverText
	}

	switch (status) {
		case 401:
			return '이름 또는 비밀번호를 확인해 주세요.'
		case 409:
			return '이미 가입된 이름이에요.'
		case 404:
			return '가입되지 않은 이름이에요. 고위드 카드 별칭과 같은 실명으로 가입했는지 확인해 주세요.'
		case 422:
			return '입력값을 확인해 주세요. (비밀번호 8~128자)'
		default:
			return '요청에 실패했어요. 잠시 후 다시 시도해 주세요.'
	}
}