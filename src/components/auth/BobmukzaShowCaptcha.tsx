import { Button, Modal } from 'antd'
import { CheckOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { theme } from '../../styles/theme'

const pop = keyframes`
	from {
		opacity: 0;
		transform: scale(0.96) translateY(6px);
	}
	to {
		opacity: 1;
		transform: scale(1) translateY(0);
	}
`

const spin = keyframes`
	to { transform: rotate(360deg); }
`

const StyledModal = styled(Modal)`
	&& .ant-modal-content {
		padding: 0;
		border-radius: ${theme.radius};
		border: 1px solid ${theme.line};
		background: ${theme.paper};
		box-shadow: ${theme.shadowHover};
		overflow: hidden;
		font-family: ${theme.fontBody};
		animation: ${pop} 0.28s ease both;
	}

	&& .ant-modal-header {
		margin: 0;
		padding: 16px 20px 12px;
		background: rgba(255, 255, 255, 0.98);
		border-bottom: 1px solid ${theme.line};
	}

	&& .ant-modal-title {
		font-family: ${theme.fontBody};
		font-size: 15px;
		font-weight: 700;
		color: ${theme.ink};
	}

	&& .ant-modal-body {
		padding: 18px 20px 8px;
	}

	&& .ant-modal-footer {
		margin: 0;
		padding: 14px 20px 18px;
		border: none;
	}
`

const Lead = styled.p`
	margin: 0 0 14px;
	font-size: 13px;
	line-height: 1.5;
	color: ${theme.inkSoft};
	font-weight: 500;
`

const CaptchaBox = styled.button<{ $verified: boolean; $busy: boolean }>`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	min-height: 74px;
	padding: 10px 12px 10px 14px;
	border-radius: 4px;
	border: 1px solid
		${p =>
			p.$verified
				? 'rgba(15, 143, 130, 0.55)'
				: p.$busy
					? 'rgba(20, 35, 28, 0.22)'
					: '#d3d3d3'};
	background: ${p => (p.$verified ? 'rgba(15, 143, 130, 0.06)' : '#f9f9f9')};
	box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.85);
	cursor: ${p => (p.$busy || p.$verified ? 'default' : 'pointer')};
	transition:
		border-color 0.2s ease,
		background 0.2s ease;
	text-align: left;

	&:hover:not(:disabled) {
		border-color: ${theme.teal};
		background: #fff;
	}

	&:disabled {
		cursor: default;
	}
`

const CheckArea = styled.div`
	display: flex;
	align-items: center;
	gap: 14px;
	flex: 1;
	min-width: 0;
`

const BoxVisual = styled.span<{ $verified: boolean; $busy: boolean }>`
	flex-shrink: 0;
	width: 28px;
	height: 28px;
	border-radius: 3px;
	border: 2px solid
		${p => (p.$verified ? theme.teal : p.$busy ? theme.inkSoft : '#c1c1c1')};
	background: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	color: ${theme.teal};
	font-size: 14px;
`

const SpinnerRing = styled.span`
	display: inline-block;
	width: 18px;
	height: 18px;
	border: 2px solid rgba(20, 35, 28, 0.12);
	border-top-color: ${theme.teal};
	border-radius: 50%;
	animation: ${spin} 0.75s linear infinite;
`

const LabelText = styled.span`
	font-size: 14px;
	font-weight: 600;
	color: ${theme.ink};
	letter-spacing: -0.01em;
`

/** reCAPTCHA v2 체크박스 위젯 우측 배지와 동일한 gstatic 로고 */
const RECAPTCHA_LOGO_URL =
	'https://www.gstatic.com/recaptcha/api2/logo_48.png'

const Badge = styled.div`
	flex-shrink: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 3px;
	padding-left: 10px;
	border-left: 1px solid #e8e8e8;
	min-width: 78px;
`

const RecaptchaLogo = styled.img`
	display: block;
	width: 32px;
	height: 32px;
	object-fit: contain;
	user-select: none;
	pointer-events: none;
`

const RecaptchaWordmark = styled.span`
	font-family: Roboto, Helvetica, Arial, sans-serif;
	font-size: 10px;
	font-weight: 400;
	line-height: 1.2;
	color: #555;
	letter-spacing: 0.01em;
`

const RecaptchaLegal = styled.div`
	display: flex;
	align-items: center;
	gap: 4px;
	font-family: Roboto, Helvetica, Arial, sans-serif;
	font-size: 8px;
	line-height: 1.2;
	color: #555;

	a {
		color: #555;
		text-decoration: none;

		&:hover {
			text-decoration: underline;
		}
	}
`

const ConfirmBtn = styled(Button)`
	height: 44px !important;
	border-radius: 12px !important;
	border: none !important;
	background: ${theme.ink} !important;
	color: #fff !important;
	font-weight: 700 !important;
	min-width: 120px;

	&:hover:not(:disabled) {
		background: #2a3d34 !important;
		color: #fff !important;
	}

	&:disabled {
		opacity: 0.45 !important;
	}
`

const VERIFY_MS_MIN = 900
const VERIFY_MS_MAX = 1600

type Props = {
	open: boolean
	onClose: () => void
	onVerified: () => void
}

export const BobmukzaShowCaptcha = ({ open, onClose, onVerified }: Props) => {
	const [phase, setPhase] = useState<'idle' | 'checking' | 'verified'>('idle')

	useEffect(() => {
		if (!open) {
			setPhase('idle')
		}
	}, [open])

	const busy = phase === 'checking'
	const verified = phase === 'verified'

	const startCheck = () => {
		if (busy || verified) return
		setPhase('checking')
		const wait =
			VERIFY_MS_MIN +
			Math.floor(Math.random() * (VERIFY_MS_MAX - VERIFY_MS_MIN))
		window.setTimeout(() => setPhase('verified'), wait)
	}

	const handleConfirm = () => {
		if (!verified) return
		onVerified()
	}

	return (
		<StyledModal
			title="보안 확인"
			open={open}
			centered
			width={Math.min(
				380,
				typeof window !== 'undefined' ? window.innerWidth * 0.92 : 380,
			)}
			maskStyle={{
				background: 'rgba(20, 35, 28, 0.45)',
				backdropFilter: 'blur(6px)',
			}}
			onCancel={onClose}
			destroyOnClose
			footer={
				<ConfirmBtn type="primary" disabled={!verified} onClick={handleConfirm}>
					가입 완료
				</ConfirmBtn>
			}
		>
			<Lead>자동 가입을 막기 위해 한 번만 확인해 주세요.</Lead>
			<CaptchaBox
				type="button"
				$verified={verified}
				$busy={busy}
				disabled={busy || verified}
				onClick={startCheck}
				aria-label="로봇이 아닙니다 확인"
			>
				<CheckArea>
					<BoxVisual $verified={verified} $busy={busy}>
						{busy ? (
							<SpinnerRing aria-hidden />
						) : verified ? (
							<CheckOutlined aria-hidden />
						) : null}
					</BoxVisual>
					<LabelText>
						{busy ? '확인 중…' : verified ? '확인됐어요' : '로봇이 아닙니다'}
					</LabelText>
				</CheckArea>
				<Badge aria-hidden>
					<RecaptchaLogo
						src={RECAPTCHA_LOGO_URL}
						alt=""
						width={32}
						height={32}
						decoding="async"
					/>
					<RecaptchaWordmark>reCAPTCHA</RecaptchaWordmark>
					<RecaptchaLegal>
						<a
							href="https://policies.google.com/privacy"
							target="_blank"
							rel="noopener noreferrer"
							tabIndex={-1}
							onClick={e => e.preventDefault()}
						>
							개인정보 보호
						</a>
						<span>-</span>
						<a
							href="https://policies.google.com/terms"
							target="_blank"
							rel="noopener noreferrer"
							tabIndex={-1}
							onClick={e => e.preventDefault()}
						>
							약관
						</a>
					</RecaptchaLegal>
				</Badge>
			</CaptchaBox>
		</StyledModal>
	)
}
