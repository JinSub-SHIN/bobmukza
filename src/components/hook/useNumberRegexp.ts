export const numberRegexp = (inputValue: string) => {
	const allowedRegex = /^[0-9]+$/
	return allowedRegex.test(inputValue)
}
