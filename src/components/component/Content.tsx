import { Divider } from 'antd'
import { Calculating } from './Calculating'
import { CustomCalendar } from './CustomCalendar'
import { Notice } from './Notice'

export const Content = () => {
	return (
		<>
			<Notice />
			<CustomCalendar />
			<Divider
				style={{ borderColor: '#7cb305', marginTop: 100, marginBottom: 100 }}
			>
				🍕🍟🌭🍖🍙🍕🍟🌭🍖🍙
			</Divider>
			<Calculating />
		</>
	)
}
