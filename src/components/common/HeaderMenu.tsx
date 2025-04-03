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
	padding: 25px;
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

	max-width: 67.25rem;
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
	return (
		<>
			<CustomHeader>
				<CustomFlexBox>
					<MenuDiv>
						<MenuWrapper>
							<SubMenuWrapper>
								<MenuItems>
									<MenuSpan>밥먹자</MenuSpan>
								</MenuItems>
							</SubMenuWrapper>
							{/* <SubMenuWrapper>
								<MenuItemsSmall>
									<MenuSpan></MenuSpan>
								</MenuItemsSmall>
							</SubMenuWrapper> */}
						</MenuWrapper>
					</MenuDiv>
				</CustomFlexBox>
			</CustomHeader>
		</>
	)
}
