import { useNavigate } from 'react-router-dom'
import { styled } from 'styled-components'
import { useDispatch } from 'react-redux'
import {
	clearExercises,
	clearWorkoutFormData,
} from '../../store/action/selectedExercisesSlice'

const CustomHeader = styled.div`
	width: 100%;
	background: #1a1a1a;
	color: white;
	z-index: 100;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);

	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
`

const CustomFlexBox = styled.div`
	padding: 16px 24px;
	font-size: 26px;

	@media screen and (max-width: 1024px) {
		padding: 12px 16px;
		font-size: 18px;
	}
`

const MenuDiv = styled.div`
	display: block;
`

const MenuWrapper = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	margin: 0 auto;
	gap: 1rem;

	@media screen and (max-width: 1024px) {
		flex-wrap: wrap;
		gap: 0.5rem;
	}
`

const SubMenuWrapper = styled.div`
	display: flex;
	gap: 1rem;
	align-items: center;
	width: 100%;
	justify-content: space-between;
	padding: 0 20px;

	@media screen and (max-width: 1024px) {
		gap: 0;
		padding: 0;
	}
`

const LeftMenuGroup = styled.div`
	display: flex;
	gap: 1rem;
	align-items: center;

	@media screen and (max-width: 1024px) {
		gap: 0.5rem;
	}
`

const LogoutButton = styled.button`
	background: transparent;
	border: 1px solid rgba(255, 255, 255, 0.2);
	color: white;
	padding: 8px 16px;
	border-radius: 6px;
	cursor: pointer;
	font-size: 14px;
	font-weight: 500;
	transition: all 0.2s ease;
	margin-left: auto;

	&:hover {
		background-color: rgba(255, 255, 255, 0.1);
		border-color: rgba(255, 255, 255, 0.3);
	}

	&:active {
		background-color: rgba(255, 255, 255, 0.15);
	}

	@media screen and (max-width: 1024px) {
		padding: 10px 14px;
		font-size: 13px;
	}
`

const MenuItems = styled.div`
	@media screen and (max-width: 1024px) {
		flex: 0 0 auto;
	}
`

const MenuSpan = styled.span`
	cursor: pointer;
	display: block;
	padding: 10px 20px;
	text-align: center;
	border-radius: 6px;
	transition: all 0.2s ease;
	font-weight: 500;
	font-size: 16px;

	&:hover {
		background-color: rgba(255, 255, 255, 0.1);
	}

	&:active {
		background-color: rgba(255, 255, 255, 0.15);
	}

	@media screen and (max-width: 1024px) {
		padding: 10px 14px;
		font-size: 14px;
		white-space: nowrap;
	}
`

export const TonsilMenu = () => {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const userType = localStorage.getItem('userType')

	const handleLogout = () => {
		// localStorage 데이터 삭제
		localStorage.removeItem('userType')
		localStorage.removeItem('isLoggedIn')
		localStorage.removeItem('userId')
		localStorage.removeItem('userName')
		// Redux 데이터 초기화
		dispatch(clearExercises())
		dispatch(clearWorkoutFormData())

		// 로그인 페이지로 이동
		navigate('/', { replace: true })
	}

	return (
		<>
			<CustomHeader>
				<CustomFlexBox>
					<MenuDiv>
						<MenuWrapper>
							<SubMenuWrapper>
								<LeftMenuGroup>
									{userType === 'trainer' ? (
										<>
											<MenuItems>
												<MenuSpan
													onClick={() => navigate('/member/management')}
												>
													회원관리
												</MenuSpan>
											</MenuItems>
											<MenuItems>
												<MenuSpan onClick={() => navigate('/workout/list')}>
													운동목록
												</MenuSpan>
											</MenuItems>
										</>
									) : (
										<>
											<MenuItems>
												<MenuSpan onClick={() => navigate('/workout/calendar')}>
													내 일지
												</MenuSpan>
											</MenuItems>
											<MenuItems>
												<MenuSpan onClick={() => navigate('/workout/list')}>
													운동목록
												</MenuSpan>
											</MenuItems>
										</>
									)}
								</LeftMenuGroup>
								<LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
							</SubMenuWrapper>
						</MenuWrapper>
					</MenuDiv>
				</CustomFlexBox>
			</CustomHeader>
		</>
	)
}
