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

const MobileMenuHeader = styled.div`
	@media screen and (max-width: 760px) {
		display: block;
	}

	display: none;
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

const MenuItemsSmall = styled.div`
	font-size: 1rem;
	line-height: 2rem;
`

const MenuSpan = styled.span`
	cursor: pointer;
`

const MobileMenuDiv = styled.div`
	display: none;
	padding: 0rem 2rem 2rem 2rem;
	z-index: 100;
	background-color: 'white';
	box-shadow: 1rem 1rem 1rem 0 rgba(192, 160, 160, 0.2);
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
									<MenuSpan>.</MenuSpan>
								</MenuItems>
							</SubMenuWrapper>
							<SubMenuWrapper>
								<MenuItemsSmall>
									<MenuSpan>T</MenuSpan>
								</MenuItemsSmall>
							</SubMenuWrapper>
						</MenuWrapper>
					</MenuDiv>
					<MobileMenuHeader>
						<MenuWrapper>
							<SubMenuWrapper>
								<MenuItems>
									<MenuSpan>T</MenuSpan>
								</MenuItems>
							</SubMenuWrapper>
							<SubMenuWrapper>
								{/* <MenuOutlined onClick={() => showMenu()} /> */}
							</SubMenuWrapper>
						</MenuWrapper>
					</MobileMenuHeader>
				</CustomFlexBox>
				<MobileMenuDiv>
					<SubMenuWrapper>
						<MenuItemsSmall>
							<MenuSpan>T</MenuSpan>
						</MenuItemsSmall>
					</SubMenuWrapper>
				</MobileMenuDiv>
			</CustomHeader>
		</>
	)
}
