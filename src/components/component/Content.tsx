import { Divider } from 'antd'
import { Calculating } from './Calculating'
import { CustomCalendar } from './CustomCalendar'

export const Content = () => {
	return (
		<div>
			<CustomCalendar />
			<Divider
				style={{ borderColor: '#7cb305', marginTop: 100, marginBottom: 100 }}
			>
				🍕🍟🌭🍖🍙🍕🍟🌭🍖🍙
			</Divider>
			<Calculating />
		</div>
	)
}
