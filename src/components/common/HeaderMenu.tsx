import { useNavigate } from 'react-router-dom'
import { styled } from 'styled-components'

const CustomHeader = styled.div`
	width: 100%;
	background-color: #000000;
	color: white;
	z-index: 100;

	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
`

const CustomFlexBox = styled.div`
	padding: 20px;
	font-size: 26px;
`

const MenuDiv = styled.div`
	@media screen and (max-width: 760px) {
		display: none;
	}
`

const MenuWrapper = styled.div`
	@media screen and (max-width: 760px) {
		width: 100%;
	}

	padding-left: 20vw;
	display: flex;
	justify-content: space-between;
	margin: 0 auto;
`

const SubMenuWrapper = styled.div`
	@media screen and (max-width: 760px) {
		display: block;
	}

	display: flex;
	gap: 1rem;
	/* cursor: pointer; */
`

const MenuItems = styled.div``

const MenuSpan = styled.span`
	cursor: pointer;
`

export const HeaderMenu = () => {
	const navigate = useNavigate()

	return (
		<>
			<CustomHeader>
				<CustomFlexBox>
					<MenuDiv>
						<MenuWrapper>
							<SubMenuWrapper>
								<MenuItems>
									<MenuSpan onClick={() => navigate('/')}>
										🍕🍟🌭🍖🍙🍕🍟🌭🍖🍙
									</MenuSpan>
								</MenuItems>
							</SubMenuWrapper>
							<SubMenuWrapper>
								<MenuItems>
									<MenuSpan
										style={{ marginRight: '3em' }}
										onClick={() => navigate('/test')}
									>
										🎲🎲🎲
									</MenuSpan>
								</MenuItems>
								<MenuItems>
									<MenuSpan
										style={{ marginRight: '3em' }}
										onClick={() => navigate('/coinApi')}
									>
										💎💎💎
									</MenuSpan>
								</MenuItems>
							</SubMenuWrapper>
						</MenuWrapper>
					</MenuDiv>
				</CustomFlexBox>
			</CustomHeader>
		</>
	)
}
