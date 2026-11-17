import styled from 'styled-components'
import { theme } from '../../styles/theme'

export type HomeSectionKey = 'meal' | 'coffee'

type Props = {
	active: HomeSectionKey
	onChange: (key: HomeSectionKey) => void
}

const Bar = styled.nav`
	width: 100%;
	margin: 0 0 14px;
	padding: 6px;
	display: flex;
	gap: 8px;
	box-sizing: border-box;
	border-radius: ${theme.radius};
	background: rgba(255, 255, 255, 0.88);
	border: 1px solid ${theme.line};
	box-shadow: 0 10px 28px rgba(20, 35, 28, 0.06);
	backdrop-filter: blur(10px);

	@media (max-width: 600px) {
		margin-bottom: 12px;
		padding: 5px;
		gap: 6px;
	}
`

const TabButton = styled.button<{ $active: boolean }>`
	flex: 1;
	appearance: none;
	border: 0;
	margin: 0;
	padding: 12px 16px;
	border-radius: ${theme.radiusSm};
	font-family: ${theme.fontDisplay};
	font-size: clamp(0.95rem, 2.2vw, 1.08rem);
	font-weight: ${p => (p.$active ? 700 : 500)};
	letter-spacing: -0.02em;
	cursor: pointer;
	transition:
		background 0.2s ease,
		color 0.2s ease,
		box-shadow 0.2s ease,
		transform 0.15s ease;

	color: ${p => (p.$active ? '#fff' : theme.inkSoft)};
	background: ${p =>
		p.$active
			? `linear-gradient(135deg, ${theme.teal} 0%, #0b6b62 100%)`
			: 'transparent'};
	box-shadow: ${p =>
		p.$active ? '0 8px 20px rgba(15, 143, 130, 0.35)' : 'none'};

	&:hover {
		color: ${p => (p.$active ? '#fff' : theme.ink)};
		background: ${p =>
			p.$active
				? `linear-gradient(135deg, ${theme.teal} 0%, #0b6b62 100%)`
				: theme.tealSoft};
	}

	&:active {
		transform: scale(0.99);
	}

	@media (max-width: 600px) {
		padding: 10px 8px;
		font-size: 0.92rem;
	}
`

const tabs: { key: HomeSectionKey; label: string }[] = [
	{ key: 'meal', label: '식대관리' },
	{ key: 'coffee', label: '커피내기' },
]

export const HomeSectionTabs = ({ active, onChange }: Props) => {
	return (
		<Bar role="tablist" aria-label="홈 섹션">
			{tabs.map(tab => (
				<TabButton
					key={tab.key}
					type="button"
					role="tab"
					aria-selected={active === tab.key}
					$active={active === tab.key}
					onClick={() => onChange(tab.key)}
				>
					{tab.label}
				</TabButton>
			))}
		</Bar>
	)
}