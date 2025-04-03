import { CustomCalendar } from './CustomCalendar'

export const Content = () => {
	return (
		<div style={{ height: '100vh' }}>
			<div style={{ textAlign: 'center', marginBottom: 50 }}>
				<span>4월</span>
			</div>
			<CustomCalendar />
		</div>
	)
}
