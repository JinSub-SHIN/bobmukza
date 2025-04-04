export function numberWithCommas(number: number) {
	try {
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	} catch (e) {
		return '0'
	}
}
