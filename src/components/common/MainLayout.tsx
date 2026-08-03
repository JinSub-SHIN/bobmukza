import { ReactNode, useState } from 'react'
import { Layout, FloatButton } from 'antd'
import { styled } from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { HeaderMenu } from './HeaderMenu'
import { theme } from '../../styles/theme'

const { Content, Footer } = Layout

const CustomLayout = styled(Layout)`
	position: relative;
	min-height: 100vh;
	background: transparent !important;
`

const CustomContent = styled(Content)`
	padding: 28px 24px 40px;
	animation: bm-rise 0.55s ease both;

	@media (max-width: 768px) {
		padding: 18px 14px 32px;
	}
`

const CustomFooter = styled(Footer)`
	padding: 28px 20px 36px;
	text-align: center;
	background: transparent !important;
	color: ${theme.inkSoft};
	font-family: ${theme.fontBody};
	font-weight: 500;
	letter-spacing: 0.02em;
	border-top: 1px solid ${theme.line};

	p {
		margin: 0 0 6px;
	}

	p:last-child {
		margin-bottom: 0;
		font-size: 12px;
		font-weight: 400;
		opacity: 0.85;
	}
`

interface MainParams {
	children?: ReactNode
}

const MainLayout = (params: MainParams) => {
	const navigate = useNavigate()
	const [clickCount, setClickCount] = useState(0)

	const handleSecretClick = () => {
		const newCount = clickCount + 1
		setClickCount(newCount)

		if (newCount >= 5) {
			navigate('/workout/insert')
			setClickCount(0)
		}
	}

	return (
		<>
			<CustomLayout>
				<HeaderMenu />
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
					<p>Contact me : hello2323@naver.com</p>
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

export default MainLayout
