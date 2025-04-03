import { ReactNode } from 'react'
import { Layout, FloatButton } from 'antd'
import { styled } from 'styled-components'
import { HeaderMenu } from './HeaderMenu'

const { Content, Footer } = Layout

const CustomLayout = styled(Layout)`
	position: relative;
`

const CustomContent = styled(Content)`
	height: calc(100vh + 500px);
	padding: 100px;
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

const MainLayout = (params: MainParams) => {
	return (
		<>
			<CustomLayout>
				<HeaderMenu />
				<CustomContent>{params.children}</CustomContent>
				<CustomFooter>
					<p>This site is not associated with Carenation</p>
					<p>Copyright ©2025 Created by JS</p>
					<p>All rights reserved</p>
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
