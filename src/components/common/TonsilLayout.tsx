import { ReactNode, useState } from 'react'
import { Layout, FloatButton } from 'antd'
import { styled } from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { TonsilMenu } from './TonsilMenu'

const { Content, Footer } = Layout

const CustomLayout = styled(Layout)`
	position: relative;
`

const CustomContent = styled(Content)`
	padding: 5px;
	margin-top: 30px;
	position: relative;
	min-height: calc(100vh - 200px);
`

const CustomFooter = styled(Footer)`
	padding: 24px;
	text-align: center;
	font-weight: 650;
	background-color: #ffffff;
`

interface MainParams {
	children?: ReactNode
}

export const TonsilLayout = (params: MainParams) => {
	const navigate = useNavigate()
	const [clickCount, setClickCount] = useState(0)

	const handleSecretClick = () => {
		const newCount = clickCount + 1
		setClickCount(newCount)

		if (newCount >= 5) {
			navigate('/workout/insert')
			setClickCount(0) // 리셋
		}
	}

	return (
		<>
			<CustomLayout>
				<TonsilMenu />
				<CustomContent>{params.children}</CustomContent>
				<CustomFooter>
					<p
						onClick={handleSecretClick}
						onTouchStart={handleSecretClick}
						style={{ cursor: 'pointer', userSelect: 'none' }}
					>
						Copyright ©2025 Created by JS
					</p>
					<p>All rights reserved</p>
					<p style={{ fontSize: '12px', fontWeight: 'normal' }}>
						Contact me : hello2323@naver.com
					</p>
				</CustomFooter>
				<FloatButton.Group shape="circle" style={{ right: 24 }}>
					<FloatButton.BackTop
						visibilityHeight={0}
						onClick={() => scrollTo(0, 0)}
					/>
				</FloatButton.Group>
			</CustomLayout>
		</>
	)
}
