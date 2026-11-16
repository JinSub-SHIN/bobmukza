import { Button, Input, Modal, message } from 'antd'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { getMukburimErrorMessage, postMemberSignup } from '../api/mukburim'
import {
	isBobmukzaLoggedIn,
	setBobmukzaSession,
	validateBobmukzaSignupForm,
} from '../auth/bobmukzaSession'
import { BobmukzaShowCaptcha } from '../components/auth/BobmukzaShowCaptcha'
import { theme } from '../styles/theme'

const rise = keyframes`
	from { opacity: 0; transform: translateY(16px); }
	to { opacity: 1; transform: translateY(0); }
`

const Page = styled.div`
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 24px 16px;
	box-sizing: border-box;
`

const Card = styled.div`
	width: 100%;
	max-width: 400px;
	padding: 28px 24px 24px;
	border-radius: ${theme.radius};
	background: rgba(255, 255, 255, 0.92);
	border: 1px solid ${theme.line};
	box-shadow: ${theme.shadow};
	backdrop-filter: blur(12px);
	animation: ${rise} 0.45s ease both;
`

const Brand = styled.div`
	text-align: center;
	margin-bottom: 22px;
`

const BrandEmoji = styled.div`
	font-size: 42px;
	line-height: 1;
	margin-bottom: 8px;
`

const Title = styled.h1`
	margin: 0 0 6px;
	font-family: ${theme.fontDisplay};
	font-size: clamp(1.75rem, 4vw, 2.1rem);
	font-weight: 700;
	color: ${theme.ink};
`

const Sub = styled.p`
	margin: 0;
	font-size: 14px;
	color: ${theme.inkSoft};
	font-weight: 300;
	line-height: 1.5;
`

const Form = styled.form`
	display: flex;
	flex-direction: column;
	gap: 12px;
`

const Label = styled.label`
	display: flex;
	flex-direction: column;
	gap: 6px;
	font-size: 13px;
	font-weight: 700;
	color: ${theme.ink};
`

const PrimaryBtn = styled(Button)`
	height: 48px !important;
	margin-top: 6px;
	border-radius: 12px !important;
	border: none !important;
	background: ${theme.ink} !important;
	color: #fff !important;
	font-family: ${theme.fontBody} !important;
	font-size: 16px !important;
	font-weight: 700 !important;
	box-shadow: 0 10px 24px rgba(20, 35, 28, 0.22) !important;

	&:hover:not(:disabled) {
		background: #2a3d34 !important;
		color: #fff !important;
	}
`

const BackLink = styled(Link)`
	display: block;
	margin-top: 14px;
	text-align: center;
	font-size: 14px;
	font-weight: 700;
	color: ${theme.teal};
	text-decoration: none;

	&:hover {
		color: ${theme.accent};
	}
`

const StyledConfirmModal = styled(Modal)`
	&& .ant-modal-content {
		border-radius: ${theme.radiusSm};
		font-family: ${theme.fontBody};
	}

	&& .ant-modal-header {
		padding: 16px 20px 12px;
	}

	&& .ant-modal-title {
		font-size: 16px;
		font-weight: 700;
		color: ${theme.ink};
	}

	&& .ant-modal-body {
		padding: 8px 20px 4px;
		font-size: 14px;
		line-height: 1.55;
		color: ${theme.inkSoft};
	}

	&& .ant-modal-footer {
		padding: 12px 20px 16px;
	}
`

const ConfirmCopy = styled.p`
	margin: 0;
	color: ${theme.ink};

	strong {
		font-weight: 700;
		color: ${theme.ink};
	}
`

const ConfirmHint = styled.p`
	margin: 10px 0 0;
	font-size: 13px;
	color: ${theme.inkSoft};
`

const ModalFooterActions = styled.div`
	display: flex;
	justify-content: flex-end;
	gap: 8px;
`

const CancelModalBtn = styled(Button)`
	height: 40px !important;
	border-radius: 10px !important;
	font-weight: 600 !important;
`

const ConfirmModalBtn = styled(Button)`
	height: 40px !important;
	border-radius: 10px !important;
	border: none !important;
	background: ${theme.ink} !important;
	color: #fff !important;
	font-weight: 600 !important;

	&:hover:not(:disabled) {
		background: #2a3d34 !important;
		color: #fff !important;
	}
`

export const BobmukzaSignupPage = () => {
	const navigate = useNavigate()
	const [userName, setUserName] = useState('')
	const [code, setCode] = useState('')
	const [codeConfirm, setCodeConfirm] = useState('')
	const [loading, setLoading] = useState(false)
	const [confirmOpen, setConfirmOpen] = useState(false)
	const [captchaOpen, setCaptchaOpen] = useState(false)
	const [pendingName, setPendingName] = useState('')
	const [messageApi, contextHolder] = message.useMessage()

	useEffect(() => {
		if (isBobmukzaLoggedIn()) {
			navigate('/', { replace: true })
		}
	}, [navigate])

	const completeSignup = async () => {
		const validated = validateBobmukzaSignupForm(userName, code, codeConfirm)
		if (!validated.ok) {
			setLoading(false)
			messageApi.error(validated.message)
			return
		}
		try {
			const auth = await postMemberSignup(validated.name, code)
			setBobmukzaSession(auth.name, auth.member_id)
			messageApi.success('가입 완료! 환영해요 🍚')
			navigate('/', { replace: true })
		} catch (err) {
			messageApi.error(getMukburimErrorMessage(err))
			setLoading(false)
		}
	}

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		const validated = validateBobmukzaSignupForm(userName, code, codeConfirm)
		if (!validated.ok) {
			messageApi.error(validated.message)
			return
		}

		setPendingName(validated.name)
		setConfirmOpen(true)
	}

	const handleConfirmSignup = () => {
		setConfirmOpen(false)
		setCaptchaOpen(true)
	}

	const handleCaptchaVerified = () => {
		setCaptchaOpen(false)
		setLoading(true)
		completeSignup()
	}

	return (
		<Page>
			{contextHolder}
			<Card>
				<Brand>
					<BrandEmoji aria-hidden>🍚</BrandEmoji>
					<Title>회원가입</Title>
					<Sub>이름과 비밀번호로 먹부림 계정을 만들어요.</Sub>
				</Brand>
				<Form onSubmit={onSubmit}>
					<Label>
						이름
						<Input
							size="large"
							placeholder="예: 신진섭"
							value={userName}
							onChange={ev => setUserName(ev.target.value)}
							autoComplete="username"
							maxLength={20}
						/>
					</Label>
					<Label>
						비밀번호
						<Input.Password
							size="large"
							placeholder="8자 이상"
							value={code}
							onChange={ev => setCode(ev.target.value)}
							autoComplete="new-password"
							maxLength={128}
						/>
					</Label>
					<Label>
						비밀번호 확인
						<Input.Password
							size="large"
							placeholder="한 번 더 입력"
							value={codeConfirm}
							onChange={ev => setCodeConfirm(ev.target.value)}
							autoComplete="new-password"
							maxLength={128}
						/>
					</Label>
					<PrimaryBtn type="primary" htmlType="submit" loading={loading} block>
						가입하기
					</PrimaryBtn>
				</Form>
				<BackLink to="/login">이미 계정이 있어요 → 로그인</BackLink>
			</Card>

			<StyledConfirmModal
				title="가입 확인"
				open={confirmOpen}
				centered
				width={Math.min(
					340,
					typeof window !== 'undefined' ? window.innerWidth * 0.9 : 340,
				)}
				onCancel={() => setConfirmOpen(false)}
				footer={
					<ModalFooterActions>
						<CancelModalBtn onClick={() => setConfirmOpen(false)}>
							취소
						</CancelModalBtn>
						<ConfirmModalBtn
							type="primary"
							loading={loading}
							onClick={handleConfirmSignup}
						>
							확인
						</ConfirmModalBtn>
					</ModalFooterActions>
				}
				destroyOnClose
			>
				<ConfirmCopy>
					<strong>{pendingName}</strong> 이름으로 가입할까요?
				</ConfirmCopy>
				<ConfirmHint>서비스 이용을 위해 실명으로 가입해 주세요.</ConfirmHint>
			</StyledConfirmModal>

			<BobmukzaShowCaptcha
				open={captchaOpen}
				onClose={() => setCaptchaOpen(false)}
				onVerified={handleCaptchaVerified}
			/>
		</Page>
	)
}
