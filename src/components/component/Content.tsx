import { Col, Divider, Row } from 'antd'
import { Calculating } from './Calculating'
import { CustomCalendar } from './CustomCalendar'
import { Notice } from './Notice'
import styled from 'styled-components'

const ResponsiveWrapper = styled.div`
	@media (max-width: 1600px) {
		display: none;
	}
`

const MobileWrapper = styled.div`
	display: none;

	@media (max-width: 1600px) {
		display: block;
	}
`

export const Content = () => {
	return (
		<>
			<ResponsiveWrapper>
				<Notice />
				<Row>
					<Col span={12}>
						<CustomCalendar />
					</Col>
					<Col span={12} style={{ padding: 20 }}>
						<Calculating />
					</Col>
				</Row>
			</ResponsiveWrapper>
			<MobileWrapper>
				<Notice />
				<CustomCalendar />
				<Divider
					style={{ borderColor: '#7cb305', marginTop: 15, marginBottom: 35 }}
				>
					🍕🍟🌭🍖🍙🍕🍟🌭🍖🍙
				</Divider>
				<Calculating />
			</MobileWrapper>
		</>
	)
}
