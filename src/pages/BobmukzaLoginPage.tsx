import { Button, Input, message } from 'antd'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { getMukburimErrorMessage, postMemberLogin } from '../api/mukburim'
import {
	isBobmukzaLoggedIn,
	setBobmukzaSession,
	validateBobmukzaLoginForm,
} from '../auth/bobmukzaSession'
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

const SubmitBtn = styled(Button)`
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

const SignupBtn = styled(Link)`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 46px;
	margin-top: 10px;
	border-radius: 12px;
	border: 1px solid ${theme.lineStrong};
	background: rgba(255, 255, 255, 0.85);
	color: ${theme.ink};
	font-family: ${theme.fontBody};
	font-size: 15px;
	font-weight: 700;
	text-decoration: none;
	transition:
		border-color 0.15s ease,
		background 0.15s ease;

	&:hover {
		border-color: ${theme.teal};
		color: ${theme.teal};
		background: #fff;
	}
`

export const BobmukzaLoginPage = () => {
	const navigate = useNavigate()
	const [userName, setUserName] = useState('')
	const [code, setCode] = useState('')
	const [loading, setLoading] = useState(false)
	const [messageApi, contextHolder] = message.useMessage()

	useEffect(() => {
		if (isBobmukzaLoggedIn()) {
			navigate('/', { replace: true })
		}
	}, [navigate])

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		const result = validateBobmukzaLoginForm(userName, code)
		if (!result.ok) {
			messageApi.error(result.message)
			return
		}
		setLoading(true)
		try {
			const auth = await postMemberLogin(result.name, code)
			setBobmukzaSession(auth.name, auth.member_id)
			navigate('/', { replace: true })
		} catch (err) {
			messageApi.error(getMukburimErrorMessage(err))
		} finally {
			setLoading(false)
		}
	}

	return (
		<Page>
			{contextHolder}
			<Card>
				<Brand>
					<BrandEmoji aria-hidden>🍱</BrandEmoji>
					<Title>먹부림</Title>
					<Sub>로그인 후 이번 달 식대를 관리해요.</Sub>
				</Brand>
				<Form onSubmit={onSubmit}>
					<Label>
						이름
						<Input
							size="large"
							placeholder="예: 홍길동"
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
							placeholder="비밀번호"
							value={code}
							onChange={ev => setCode(ev.target.value)}
							autoComplete="current-password"
							maxLength={128}
						/>
					</Label>
					<SubmitBtn type="primary" htmlType="submit" loading={loading} block>
						들어가기 🍚
					</SubmitBtn>
				</Form>
				<SignupBtn to="/signup">3초 회원가입</SignupBtn>
			</Card>
		</Page>
	)
}
