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

	@media screen and (max-width: 1024px) {
		padding: 15px;
		font-size: 18px;
	}
`

const MenuDiv = styled.div`
	display: block;
`

const MenuWrapper = styled.div`
	padding-left: 20vw;
	display: flex;
	justify-content: space-between;
	margin: 0 auto;
	gap: 1rem;

	@media screen and (max-width: 1024px) {
		width: 100%;
		padding-left: 0;
		padding-right: 0;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
`

const SubMenuWrapper = styled.div`
	display: flex;
	gap: 1rem;
	align-items: center;

	@media screen and (max-width: 1024px) {
		width: 100%;
		justify-content: space-between;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
`

const MenuItems = styled.div`
	@media screen and (max-width: 1024px) {
		flex: 0 0 auto;

		&:first-child {
			flex: 1 1 100%;
			width: 100%;
		}

		&:not(:first-child) {
			flex: 0 0 calc(50% - 0.25rem);
			max-width: calc(50% - 0.25rem);
		}
	}
`

const MenuSpan = styled.span`
	cursor: pointer;
	display: block;
	padding: 8px 12px;
	text-align: center;
	border-radius: 4px;
	transition: background-color 0.2s ease;

	&:hover {
		background-color: rgba(255, 255, 255, 0.1);
	}

	&:active {
		background-color: rgba(255, 255, 255, 0.2);
	}

	@media screen and (max-width: 1024px) {
		padding: 12px 8px;
		font-size: 0.9em;
		width: 100%;
	}
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
								<MenuItems>
									<MenuSpan onClick={() => navigate('/test')}>🎲🎲🎲</MenuSpan>
								</MenuItems>
								<MenuItems>
									<MenuSpan onClick={() => navigate('/coinApi')}>
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
