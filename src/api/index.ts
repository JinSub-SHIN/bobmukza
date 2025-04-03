import axios from 'axios'

export const getHoliday = async (year: string, month: string) => {
	const url =
		'http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo'

	const holidayKey =
		'AwOQo6YEaZQEdwgYEcu0MqhFe350qUdMswEJiF23I2VYvkROTncVDMiMkiod6vhWj4lEdvr1GYoxNNF0pyF/rw=='

	const queryParams = {
		serviceKey: holidayKey,
		solYear: year,
		solMonth: month,
		numOfRows: 30,
	}

	try {
		const response = await axios.get(url, { params: queryParams })
		return response.data
	} catch (error) {
		throw error
	}
}
