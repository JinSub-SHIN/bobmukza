import { useState, useEffect } from 'react'
import { styled } from 'styled-components'
import { Button, Modal, Checkbox } from 'antd'
import { InfoCircleOutlined, MailOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

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

const ButtonGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	width: 100%;

	@media screen and (max-width: 768px) {
		gap: 12px;
	}

	@media screen and (max-width: 480px) {
		gap: 10px;
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

export const LoginScreen = () => {
	const navigate = useNavigate()
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [dontShowAgain, setDontShowAgain] = useState(false)

	useEffect(() => {
		const shouldShowModal =
			localStorage.getItem('dontShowLoginNotice') !== 'true'
		if (shouldShowModal) {
			setIsModalOpen(true)
		}
	}, [])

	const handleModalOk = () => {
		if (dontShowAgain) {
			localStorage.setItem('dontShowLoginNotice', 'true')
		}
		setIsModalOpen(false)
	}

	const handleMemberLogin = () => {
		navigate('/member/login')
	}

	const handleTrainerLogin = () => {
		navigate('/trainer/login')
	}

	return (
		<LoginContainer>
			<LoginCard>
				<Title>운동 일지 관리</Title>
				<Subtitle>로그인 유형을 선택해주세요</Subtitle>
				<ButtonGroup>
					<LoginButton className="member-btn" onClick={handleMemberLogin}>
						일반 회원이에요
					</LoginButton>
					<LoginButton className="trainer-btn" onClick={handleTrainerLogin}>
						트레이너에요
					</LoginButton>
				</ButtonGroup>
			</LoginCard>
			<Modal
				title={
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: '10px',
							fontSize: '22px',
							fontWeight: 700,
							color: '#1a1a1a',
						}}
					>
						<InfoCircleOutlined
							style={{
								fontSize: '24px',
								color: '#10b981',
							}}
						/>
						안내
					</div>
				}
				open={isModalOpen}
				onOk={handleModalOk}
				okText="확인"
				centered
				width={480}
				closable={false}
				cancelButtonProps={{ style: { display: 'none' } }}
				okButtonProps={{
					style: {
						height: '44px',
						fontSize: '16px',
						fontWeight: 600,
						borderRadius: '10px',
						background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
						borderColor: '#10b981',
						boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
					},
				}}
				styles={{
					content: {
						borderRadius: '20px',
						padding: '32px',
						boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
					},
					header: {
						borderBottom: 'none',
						paddingBottom: '0',
						marginBottom: '24px',
					},
					body: {
						padding: '0',
					},
					footer: {
						borderTop: 'none',
						paddingTop: '24px',
						marginTop: '24px',
					},
				}}
			>
				<div style={{ fontSize: '16px', lineHeight: '1.8', color: '#4b5563' }}>
					<div
						style={{
							background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
							borderRadius: '12px',
							padding: '20px',
							marginBottom: '24px',
							border: '1px solid #bbf7d0',
						}}
					>
						<p
							style={{
								margin: '0 0 16px 0',
								fontSize: '15px',
								color: '#166534',
								lineHeight: '1.6',
							}}
						>
							회원 서비스 가입 문의는 하단의 연락처로 연락바랍니다.
						</p>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: '10px',
								background: 'white',
								padding: '14px 16px',
								borderRadius: '10px',
								border: '2px solid #10b981',
								marginTop: '12px',
							}}
						>
							<MailOutlined
								style={{
									fontSize: '20px',
									color: '#10b981',
								}}
							/>
							<span
								style={{
									fontSize: '16px',
									fontWeight: 600,
									color: '#059669',
									letterSpacing: '0.3px',
								}}
							>
								hello2323@naver.com
							</span>
						</div>
					</div>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							paddingTop: '16px',
							borderTop: '1px solid #f0f0f0',
						}}
					>
						<Checkbox
							checked={dontShowAgain}
							onChange={e => setDontShowAgain(e.target.checked)}
							style={{
								fontSize: '14px',
								color: '#6b7280',
							}}
						>
							다시 보지 않음
						</Checkbox>
					</div>
				</div>
			</Modal>
		</LoginContainer>
	)
}
