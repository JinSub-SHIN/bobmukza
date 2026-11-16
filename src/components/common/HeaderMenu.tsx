import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { styled, keyframes } from 'styled-components'
import {
	clearBobmukzaSession,
	getBobmukzaUserName,
} from '../../auth/bobmukzaSession'
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

	@media screen and (max-width: 600px) {
		padding: 14px 12px 12px;
		gap: 12px;
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
	flex: 1 1 auto;
	min-width: 0;

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
		white-space: nowrap;
	}

	@media screen and (max-width: 600px) {
		.tag {
			white-space: normal;
		}
	}

	&:hover .brand {
		color: #ffe8e1;
	}
`

const HeaderActions = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
	flex: 0 0 auto;
	flex-shrink: 0;

	@media screen and (max-width: 900px) {
		width: 100%;
		justify-content: flex-end;
	}

	@media screen and (max-width: 600px) {
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 8px;
	}

	.user {
		font-size: 0.88rem;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.85);
		padding: 6px 12px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.12);
	}
`

const LogoutBtn = styled(Button)`
	height: 38px !important;
	border-radius: 10px !important;
	font-family: ${theme.fontBody} !important;
	font-weight: 700 !important;
	border-color: rgba(255, 255, 255, 0.25) !important;
	background: rgba(255, 255, 255, 0.08) !important;
	color: #fff !important;

	&:hover {
		border-color: ${theme.accent} !important;
		color: #ffe8e1 !important;
		background: rgba(255, 90, 54, 0.2) !important;
	}
`

export const HeaderMenu = () => {
	const navigate = useNavigate()
	const displayName = getBobmukzaUserName()

	const handleLogout = () => {
		clearBobmukzaSession()
		navigate('/login', { replace: true })
	}

	return (
		<CustomHeader>
			<Shell>
				<BrandBlock type="button" onClick={() => navigate('/')}>
					<span className="brand">먹부림</span>
					<span className="tag">이번 달 식대, 한눈에</span>
				</BrandBlock>
				<HeaderActions>
					{displayName ? (
						<span className="user">{displayName}님</span>
					) : null}
					<LogoutBtn size="middle" onClick={handleLogout}>
						로그아웃
					</LogoutBtn>
				</HeaderActions>
			</Shell>
		</CustomHeader>
	)
}
