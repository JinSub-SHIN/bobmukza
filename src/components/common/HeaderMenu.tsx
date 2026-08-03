import { useNavigate } from 'react-router-dom'
import { styled, keyframes } from 'styled-components'
import { theme } from '../../styles/theme'

const brandPulse = keyframes`
	0%, 100% { transform: translateY(0); }
	50% { transform: translateY(-2px); }
`

const CustomHeader = styled.header`
	width: 100%;
	position: relative;
	z-index: 100;
	padding-top: env(safe-area-inset-top);
	margin-top: calc(-1 * env(safe-area-inset-top, 0px));
	background: linear-gradient(
		120deg,
		rgba(20, 35, 28, 0.96) 0%,
		rgba(15, 80, 72, 0.94) 55%,
		rgba(20, 35, 28, 0.96) 100%
	);
	border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	box-shadow: 0 12px 40px rgba(20, 35, 28, 0.18);
	-webkit-touch-callout: none;
	user-select: none;
`

const Shell = styled.div`
	max-width: 1680px;
	margin: 0 auto;
	padding: 22px 28px 20px;
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
	gap: 24px;

	@media screen and (max-width: 900px) {
		flex-direction: column;
		align-items: stretch;
		padding: 18px 16px 16px;
		gap: 14px;
	}
`

const BrandBlock = styled.button`
	appearance: none;
	border: 0;
	background: transparent;
	padding: 0;
	cursor: pointer;
	text-align: left;
	color: #fff;
	animation: ${brandPulse} 4.5s ease-in-out infinite;

	.brand {
		display: block;
		font-family: ${theme.fontDisplay};
		font-size: clamp(2.1rem, 4vw, 3rem);
		line-height: 1;
		letter-spacing: -0.02em;
		color: #fff;
		text-shadow: 0 8px 28px rgba(255, 90, 54, 0.35);
	}

	.tag {
		display: block;
		margin-top: 8px;
		font-family: ${theme.fontBody};
		font-size: 0.92rem;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.72);
		letter-spacing: 0.04em;
	}

	&:hover .brand {
		color: #ffe8e1;
	}
`

export const HeaderMenu = () => {
	const navigate = useNavigate()

	return (
		<CustomHeader>
			<Shell>
				<BrandBlock type="button" onClick={() => navigate('/')}>
					<span className="brand">밥먹자</span>
					<span className="tag">이번 달 식대, 한눈에</span>
				</BrandBlock>
			</Shell>
		</CustomHeader>
	)
}
