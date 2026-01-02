import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { styled, keyframes } from 'styled-components'
import { Input, Button, InputRef, Modal } from 'antd'
import { supabase } from '../../../database/supabase'

const fadeInUp = keyframes`
	from {
		opacity: 0;
		transform: translateY(30px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
`

const slideOut = keyframes`
	from {
		opacity: 1;
		transform: translateX(0);
	}
	to {
		opacity: 0;
		transform: translateX(-30px);
	}
`

const slideIn = keyframes`
	from {
		opacity: 0;
		transform: translateX(30px);
	}
	to {
		opacity: 1;
		transform: translateX(0);
	}
`

const LoginContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	min-height: 100vh;
	width: 100vw;
	padding: 20px;
	box-sizing: border-box;

	@media screen and (max-width: 768px) {
		padding: 16px;
	}

	@media screen and (max-width: 480px) {
		padding: 12px;
	}
`

const LoginCard = styled.div`
	background: white;
	border-radius: 20px;
	padding: 60px 80px;
	box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
	text-align: center;
	max-width: 500px;
	width: 100%;
	box-sizing: border-box;
	position: relative;
	overflow: hidden;

	@media screen and (max-width: 768px) {
		padding: 40px 30px;
		border-radius: 16px;
		max-width: 450px;
	}

	@media screen and (max-width: 480px) {
		padding: 30px 20px;
		border-radius: 12px;
		max-width: 100%;
	}
`

const StepContainer = styled.div<{ isVisible: boolean; isEntering: boolean }>`
	animation: ${props =>
			props.isEntering ? slideIn : props.isVisible ? fadeInUp : slideOut}
		0.5s ease-out;
	opacity: ${props => (props.isVisible ? 1 : 0)};
`

const Title = styled.h1`
	font-size: 32px;
	font-weight: 700;
	margin-bottom: 10px;
	color: #333;
	line-height: 1.2;

	@media screen and (max-width: 768px) {
		font-size: 24px;
		margin-bottom: 8px;
	}

	@media screen and (max-width: 480px) {
		font-size: 20px;
		margin-bottom: 6px;
	}
`

const Subtitle = styled.p`
	font-size: 16px;
	color: #666;
	margin-bottom: 40px;
	line-height: 1.5;

	@media screen and (max-width: 768px) {
		font-size: 14px;
		margin-bottom: 30px;
	}

	@media screen and (max-width: 480px) {
		font-size: 13px;
		margin-bottom: 24px;
	}
`

const InputWrapper = styled.div`
	margin-bottom: 30px;

	@media screen and (max-width: 480px) {
		margin-bottom: 24px;
	}
`

const OTPContainer = styled.div`
	display: flex;
	justify-content: center;
	gap: 12px;
	margin-bottom: 30px;

	@media screen and (max-width: 480px) {
		gap: 8px;
		margin-bottom: 24px;
	}
`

const OTPInput = styled(Input)`
	width: 60px;
	height: 60px;
	font-size: 24px;
	font-weight: 700;
	text-align: center;
	border-radius: 12px;
	border: 2px solid #e5e7eb;
	transition: all 0.3s ease;

	&:focus {
		border-color: #10b981;
		box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
	}

	@media screen and (max-width: 768px) {
		width: 55px;
		height: 55px;
		font-size: 20px;
		border-radius: 10px;
	}

	@media screen and (max-width: 480px) {
		width: 50px;
		height: 50px;
		font-size: 18px;
		border-radius: 8px;
	}
`

const StyledInput = styled(Input)`
	height: 56px;
	font-size: 16px;
	border-radius: 12px;
	border: 2px solid #e5e7eb;
	transition: all 0.3s ease;

	&:focus,
	&:hover {
		border-color: #10b981;
		box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
	}

	@media screen and (max-width: 768px) {
		height: 50px;
		font-size: 15px;
		border-radius: 10px;
	}

	@media screen and (max-width: 480px) {
		height: 48px;
		font-size: 14px;
		border-radius: 8px;
	}
`

const LoginButton = styled(Button)`
	height: 56px;
	font-size: 18px;
	font-weight: 600;
	border-radius: 12px;
	border: none !important;
	transition: all 0.3s ease;
	width: 100%;

	&.member-btn {
		background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
		color: white !important;

		&:hover {
			background: linear-gradient(135deg, #059669 0%, #047857 100%) !important;
			transform: translateY(-2px);
			box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
		}

		&:focus {
			background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
			color: white !important;
		}
	}

	&.trainer-btn {
		background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
		color: white !important;

		&:hover {
			background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%) !important;
			transform: translateY(-2px);
			box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
		}

		&:focus {
			background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
			color: white !important;
		}
	}

	&:active {
		transform: translateY(0);
	}

	@media screen and (max-width: 768px) {
		height: 50px;
		font-size: 16px;
		border-radius: 10px;
	}

	@media screen and (max-width: 480px) {
		height: 48px;
		font-size: 15px;
		border-radius: 8px;
	}
`

export const LoginStep = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const [step, setStep] = useState(0) // 0: 아이디 입력, 1: OTP 입력
	const [userId, setUserId] = useState('')
	const [otp, setOtp] = useState(['', '', '', ''])
	const [isEntering, setIsEntering] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const otpRefs = useRef<(InputRef | null)[]>([])
	const isMember = location.pathname.includes('/member/login')

	const handleNext = () => {
		if (!userId.trim()) {
			return
		}
		setIsEntering(true)
		setTimeout(() => {
			setStep(1)
			setIsEntering(false)
		}, 250)
	}

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && step === 0) {
			handleNext()
		}
	}

	const handleOTPChange = (index: number, value: string) => {
		if (value.length > 1) {
			value = value.slice(-1)
		}

		if (!/^\d*$/.test(value)) {
			return
		}

		const newOtp = [...otp]
		newOtp[index] = value
		setOtp(newOtp)

		if (value && index < 3) {
			otpRefs.current[index + 1]?.input?.focus()
		}
	}

	const handleOTPKeyDown = (
		index: number,
		e: React.KeyboardEvent<HTMLInputElement>,
	) => {
		if (e.key === 'Backspace' && !otp[index] && index > 0) {
			otpRefs.current[index - 1]?.input?.focus()
		}
	}

	const handleOTPKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		// 숫자(0-9)와 Backspace, Delete, Arrow keys만 허용
		const allowedKeys = [
			'0',
			'1',
			'2',
			'3',
			'4',
			'5',
			'6',
			'7',
			'8',
			'9',
			'Backspace',
			'Delete',
			'ArrowLeft',
			'ArrowRight',
			'Tab',
		]

		if (!allowedKeys.includes(e.key) && !e.ctrlKey && !e.metaKey) {
			e.preventDefault()
		}
	}

	const handleOTPSubmit = async () => {
		const otpValue = otp.join('')
		if (otpValue.length !== 4) {
			return
		}

		setIsLoading(true)

		try {
			const expectedUserType = isMember ? 1 : 2

			// supabase에서 users 테이블 조회 (pin_number는 보안상 제외)
			const { data, error } = await supabase
				.from('users')
				.select('user_id, user_name, user_type')
				.eq('user_id', userId)
				.eq('user_type', expectedUserType)
				.eq('pin_number', otpValue)
				.single()

			if (error || !data) {
				// 로그인 실패
				setIsModalOpen(true)
				setIsLoading(false)
				return
			}

			// 로그인 성공
			const userType = isMember ? 'member' : 'trainer'
			localStorage.setItem('userType', userType)
			localStorage.setItem('isLoggedIn', 'true')
			localStorage.setItem('userId', userId)
			if (data.user_name) {
				localStorage.setItem('userName', data.user_name)
			}

			// userType에 따라 리다이렉트
			if (userType === 'trainer') {
				navigate('/member/management', { replace: true })
			} else {
				navigate('/workout/calendar', { replace: true })
			}
		} catch (error) {
			console.error('Login error:', error)
			setIsModalOpen(true)
			setIsLoading(false)
		}
	}

	const handleModalClose = () => {
		setIsModalOpen(false)
		// OTP 초기화
		setOtp(['', '', '', ''])
		if (otpRefs.current[0]) {
			otpRefs.current[0].input?.focus()
		}
	}

	useEffect(() => {
		if (step === 1 && otpRefs.current[0]) {
			otpRefs.current[0].input?.focus()
		}
	}, [step])

	// OTP 자동 제출은 제거하고 버튼 클릭으로만 처리

	return (
		<LoginContainer>
			<LoginCard>
				{step === 0 ? (
					<StepContainer isVisible={true} isEntering={false}>
						<Title>로그인</Title>
						<Subtitle>
							{isMember
								? '회원 아이디를 입력하세요.'
								: '트레이너 아이디를 입력하세요.'}
						</Subtitle>
						<InputWrapper>
							<StyledInput
								placeholder={
									isMember
										? '회원 아이디를 입력하세요.'
										: '트레이너 아이디를 입력하세요.'
								}
								value={userId}
								onChange={e => setUserId(e.target.value)}
								onKeyPress={handleKeyPress}
								autoFocus
							/>
						</InputWrapper>
						<LoginButton
							className={isMember ? 'member-btn' : 'trainer-btn'}
							onClick={handleNext}
							disabled={!userId.trim()}
						>
							다음
						</LoginButton>
					</StepContainer>
				) : (
					<StepContainer isVisible={true} isEntering={isEntering}>
						<Title>OTP 인증</Title>
						<Subtitle>
							{isMember
								? '회원님의 OTP를 입력해주세요.'
								: '트레이너님의 OTP를 입력해주세요.'}
						</Subtitle>
						<OTPContainer>
							{otp.map((digit, index) => (
								<OTPInput
									key={index}
									ref={el => {
										otpRefs.current[index] = el
									}}
									type="tel"
									inputMode="numeric"
									pattern="[0-9]*"
									value={digit}
									onChange={e => handleOTPChange(index, e.target.value)}
									onKeyDown={e => handleOTPKeyDown(index, e)}
									onKeyPress={handleOTPKeyPress}
									maxLength={1}
								/>
							))}
						</OTPContainer>
						<LoginButton
							className={isMember ? 'member-btn' : 'trainer-btn'}
							disabled={otp.join('').length !== 4 || isLoading}
							loading={isLoading}
							onClick={handleOTPSubmit}
						>
							로그인
						</LoginButton>
					</StepContainer>
				)}
			</LoginCard>
			<Modal
				title={
					<div style={{ fontSize: '20px', fontWeight: 600, color: '#1a1a1a' }}>
						로그인 실패
					</div>
				}
				open={isModalOpen}
				onOk={handleModalClose}
				onCancel={handleModalClose}
				okText="확인"
				cancelButtonProps={{ style: { display: 'none' } }}
				centered
				width={420}
				okButtonProps={{
					style: {
						height: '40px',
						fontSize: '15px',
						fontWeight: 600,
						borderRadius: '8px',
						background: '#ef4444',
						borderColor: '#ef4444',
					},
				}}
				styles={{
					content: {
						borderRadius: '16px',
						padding: '24px',
					},
					header: {
						borderBottom: '1px solid #f0f0f0',
						paddingBottom: '16px',
						marginBottom: '20px',
					},
					body: {
						padding: '0',
					},
					footer: {
						borderTop: '1px solid #f0f0f0',
						paddingTop: '16px',
						marginTop: '24px',
					},
				}}
			>
				<div style={{ fontSize: '16px', lineHeight: '1.8', color: '#4b5563' }}>
					<p style={{ margin: '0 0 8px 0' }}>로그인 정보가 다릅니다.</p>
					<p style={{ margin: '0' }}>로그인 문의는 관리자를 통해 가능합니다.</p>
				</div>
			</Modal>
		</LoginContainer>
	)
}
