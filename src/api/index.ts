import axios from 'axios'

export type HolidayItem = {
	dateKind?: string
	dateName: string
	isHoliday?: string
	locdate: string | number
	seq?: string | number
}

/** 공공데이터 응답이 response 래핑 / 미래핑 둘 다 올 수 있어 정규화 */
export function normalizeHolidayItems(data: unknown): HolidayItem[] {
	const root = data as {
		response?: { body?: { items?: unknown } }
		body?: { items?: unknown }
	}
	const items = root?.response?.body?.items ?? root?.body?.items

	// 휴일 0건이면 items가 "" 또는 빈 객체
	if (!items || items === '') return []

	const raw =
		typeof items === 'object' && items !== null && 'item' in items
			? (items as { item: HolidayItem | HolidayItem[] }).item
			: undefined

	if (!raw) return []
	return Array.isArray(raw) ? raw : [raw]
}

export const getHoliday = async (year: string, month: string) => {
	const url =
		'https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo'

	const holidayKey =
		'AwOQo6YEaZQEdwgYEcu0MqhFe350qUdMswEJiF23I2VYvkROTncVDMiMkiod6vhWj4lEdvr1GYoxNNF0pyF/rw=='

	const queryParams = {
		serviceKey: holidayKey,
		solYear: year,
		solMonth: month,
		numOfRows: 30,
		_type: 'json',
	}

	const response = await axios.get(url, { params: queryParams })
	return response.data
}

export const getTetherPriceApi = async (coinKey: string) => {
	const url = `https://api.bithumb.com/v1/ticker?markets=${coinKey}`
	try {
		const response = await axios.get(url)
		return response
	} catch (error) {
		throw error
	}
}

export const buyTetherApi = async (params: any, config: any) => {
	const url = 'https://api.bithumb.com/v1/orders'

	try {
		const response = await axios.post(url, params, config)
		return response
	} catch (error) {
		throw error
	}
}

export const coinListApi = async () => {
	const url = 'https://api.bithumb.com/v1/market/all'
	try {
		const response = await axios.get(url)
		return response
	} catch (error) {
		throw error
	}
}
