import { useState } from 'react'
import styled from 'styled-components'
import { theme } from '../../styles/theme'
import { HomeSectionTabs, HomeSectionKey } from './HomeSectionTabs'
import { MealManageSection } from './MealManageSection'
import { CoffeeTreatSection } from './CoffeeTreatSection'

const Shell = styled.div`
	font-family: ${theme.fontBody};
	color: ${theme.ink};
	animation: bm-rise 0.65s ease 0.05s both;
`

/** 인트로·달력·계산 패널이 같은 가로폭을 쓰도록 한 컬럼 */
const PageColumn = styled.div`
	width: 100%;
	max-width: 1680px;
	margin: 0 auto;
	padding: 0 20px 12px;
	box-sizing: border-box;

	@media (max-width: 900px) {
		padding: 0 12px 16px;
	}

	@media (max-width: 600px) {
		padding: 0 10px 20px;
	}
`

const SectionPanel = styled.div`
	animation: bm-rise 0.4s ease both;
`

export const Content = () => {
	const [section, setSection] = useState<HomeSectionKey>('meal')

	return (
		<Shell>
			<PageColumn>
				<HomeSectionTabs active={section} onChange={setSection} />
				<SectionPanel role="tabpanel">
					{section === 'meal' ? <MealManageSection /> : <CoffeeTreatSection />}
				</SectionPanel>
			</PageColumn>
		</Shell>
	)
}