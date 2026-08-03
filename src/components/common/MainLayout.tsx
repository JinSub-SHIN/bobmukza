import { ReactNode, useState } from 'react'
import { Layout, FloatButton } from 'antd'
import { styled, keyframes } from 'styled-components'
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

const riseSoft = keyframes`
	from {
		opacity: 0;
		transform: translateY(10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
`

const CustomFooter = styled(Footer)`
	padding: 0 !important;
	background: transparent !important;
	font-family: ${theme.fontBody};
`

const FooterShell = styled.div`
	width: 100%;
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	animation: ${riseSoft} 0.55s ease both;
`

const FooterCard = styled.div`
	position: relative;
	overflow: hidden;
	width: 100%;
	margin: 0;
	padding: 28px 28px 24px;
	border-radius: 0;
	border: none;
	border-top: 1px solid rgba(255, 255, 255, 0.08);
	background: linear-gradient(
		145deg,
		rgba(20, 35, 28, 0.96) 0%,
		rgba(15, 80, 72, 0.94) 55%,
		rgba(20, 35, 28, 0.96) 100%
	);
	box-shadow: none;
	color: rgba(255, 255, 255, 0.88);

	&::before {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			radial-gradient(
				circle at 12% 20%,
				rgba(255, 90, 54, 0.22),
				transparent 42%
			),
			radial-gradient(
				circle at 88% 80%,
				rgba(15, 143, 130, 0.28),
				transparent 40%
			);
	}

	&::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		height: 2px;
		background: linear-gradient(
			90deg,
			transparent,
			rgba(255, 90, 54, 0.7),
			rgba(15, 143, 130, 0.7),
			transparent
		);
	}
`

const FooterInner = styled.div`
	position: relative;
	z-index: 1;
	width: 100%;
	max-width: 1680px;
	margin: 0 auto;
	padding: 0 28px;
	box-sizing: border-box;
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
	gap: 20px;

	@media (max-width: 720px) {
		flex-direction: column;
		align-items: flex-start;
		padding: 0 18px;
	}
`

const BrandCol = styled.div`
	min-width: 0;
`

const BrandMark = styled.button`
	appearance: none;
	border: 0;
	background: transparent;
	padding: 0;
	cursor: pointer;
	text-align: left;
	color: inherit;

	.logo {
		display: block;
		font-family: ${theme.fontDisplay};
		font-size: clamp(1.6rem, 3vw, 2rem);
		line-height: 1;
		letter-spacing: -0.02em;
		color: #fff;
		text-shadow: 0 8px 24px rgba(255, 90, 54, 0.28);
	}

	.tag {
		display: block;
		margin-top: 8px;
		font-size: 0.88rem;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.68);
		letter-spacing: 0.02em;
	}

	&:hover .logo {
		color: #ffe8e1;
	}
`

const MetaCol = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 8px;
	text-align: right;

	@media (max-width: 720px) {
		align-items: flex-start;
		text-align: left;
		width: 100%;
		padding-top: 4px;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}
`

const CopyLine = styled.button`
	appearance: none;
	border: 0;
	background: transparent;
	padding: 0;
	cursor: pointer;
	font-family: ${theme.fontBody};
	font-size: 0.92rem;
	font-weight: 600;
	color: rgba(255, 255, 255, 0.9);
	user-select: none;

	&:hover {
		color: #fff;
	}
`

const Reserved = styled.span`
	font-size: 0.78rem;
	font-weight: 500;
	color: rgba(255, 255, 255, 0.5);
	letter-spacing: 0.04em;
`

const MailLink = styled.a`
	display: inline-flex;
	align-items: center;
	gap: 8px;
	margin-top: 2px;
	padding: 8px 12px;
	border-radius: 10px;
	border: 1px solid rgba(255, 255, 255, 0.14);
	background: rgba(255, 255, 255, 0.06);
	color: #fff;
	text-decoration: none;
	font-size: 0.86rem;
	font-weight: 600;
	backdrop-filter: blur(6px);
	transition:
		background 0.2s ease,
		border-color 0.2s ease,
		transform 0.15s ease;

	span.label {
		color: rgba(255, 255, 255, 0.55);
		font-weight: 500;
		font-size: 0.75rem;
	}

	&:hover {
		background: rgba(255, 90, 54, 0.22);
		border-color: rgba(255, 90, 54, 0.45);
		transform: translateY(-1px);
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
					<FooterShell>
						<FooterCard>
							<FooterInner>
								<BrandCol>
									<BrandMark type="button" onClick={() => navigate('/')}>
										<span className="logo">먹부림</span>
										<span className="tag">이번 달 식대, 한눈에</span>
									</BrandMark>
								</BrandCol>
								<MetaCol>
									<CopyLine
										type="button"
										onClick={handleSecretClick}
										onTouchStart={handleSecretClick}
									>
										© 2025 Created by JS
									</CopyLine>
									<Reserved>All rights reserved</Reserved>
									<MailLink href="mailto:dev_fe_js@carenation.kr">
										<span className="label">Contact</span>
										dev_fe_js@carenation.kr
									</MailLink>
								</MetaCol>
							</FooterInner>
						</FooterCard>
					</FooterShell>
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
