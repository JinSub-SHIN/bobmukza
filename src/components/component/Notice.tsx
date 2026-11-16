import { Button, Drawer } from 'antd'
import { useState } from 'react'
import styled from 'styled-components'
import { theme } from '../../styles/theme'

const HELP_SECTIONS = [
	{
		emoji: '💳',
		title: '금액 입력',
		body: '하단 입력창에 금액을 넣으면 잔액이랑, 남은 근무일 기준 하루 평균 식대를 바로 볼 수 있어요.',
		tone: 'mint' as const,
	},
	{
		emoji: '📅',
		title: '달력 클릭',
		body: '날짜를 눌러 휴가·야근·주말 출근 등을 골라주세요. 계산에 자동으로 반영돼요.',
		tone: 'sky' as const,
	},
	{
		emoji: '⏰',
		title: '근무일수',
		body: '점심 전이면 당일 근무일, 점심 후면 제외예요. 오전반차도 점심 안 먹으니까 빼요.',
		tone: 'accent' as const,
	},
	{
		emoji: '🗓️',
		title: '달력 표시',
		body: '평일·주말 휴무는 기본으로 비워 둬요. 이번 달만 관리하면 됩니다.',
		tone: 'teal' as const,
	},
]

const HelpButton = styled(Button)`
	height: 44px !important;
	padding: 0 18px !important;

	@media (max-width: 600px) {
		height: 48px !important;
		font-size: 15px !important;
	}
	border-radius: 12px !important;
	border: 1px solid ${theme.lineStrong} !important;
	background: rgba(255, 255, 255, 0.72) !important;
	color: ${theme.ink} !important;
	font-family: ${theme.fontBody} !important;
	font-weight: 700 !important;
	box-shadow: 0 8px 20px rgba(20, 35, 28, 0.06) !important;
	backdrop-filter: blur(8px);
	gap: 6px !important;

	&:hover {
		border-color: ${theme.accent} !important;
		color: ${theme.accent} !important;
		background: #fff !important;
	}
`

const DrawerIntro = styled.p`
	margin: 0 0 20px;
	padding: 14px 16px;
	border-radius: ${theme.radiusSm};
	background: linear-gradient(
		135deg,
		${theme.mint} 0%,
		${theme.sky} 55%,
		rgba(255, 255, 255, 0.9) 100%
	);
	border: 1px solid ${theme.line};
	font-size: 15px;
	line-height: 1.55;
	color: ${theme.ink};
	font-weight: 700;
	text-align: center;
`

const TipList = styled.ul`
	list-style: none;
	margin: 0;
	padding: 0;
	display: flex;
	flex-direction: column;
	gap: 12px;
`

const tipBackground: Record<(typeof HELP_SECTIONS)[number]['tone'], string> = {
	mint: theme.mint,
	sky: theme.sky,
	accent: theme.accentSoft,
	teal: theme.tealSoft,
}

const TipCard = styled.li<{ $tone: (typeof HELP_SECTIONS)[number]['tone'] }>`
	display: flex;
	gap: 14px;
	align-items: flex-start;
	padding: 14px 14px 12px;
	border-radius: ${theme.radiusSm};
	border: 1px solid ${theme.line};
	background: ${p => tipBackground[p.$tone]};
	box-shadow: 0 4px 14px rgba(20, 35, 28, 0.04);
	transition:
		transform 0.15s ease,
		box-shadow 0.15s ease;

	&:hover {
		transform: translateY(-1px);
		box-shadow: 0 8px 20px rgba(20, 35, 28, 0.07);
	}
`

const TipEmoji = styled.span`
	flex-shrink: 0;
	width: 44px;
	height: 44px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 26px;
	line-height: 1;
	border-radius: 14px;
	background: rgba(255, 255, 255, 0.85);
	border: 1px solid ${theme.line};
	box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
`

const TipBody = styled.div`
	flex: 1;
	min-width: 0;
`

const TipTitle = styled.div`
	font-size: 1rem;
	font-weight: 700;
	color: ${theme.ink};
	margin-bottom: 6px;
	letter-spacing: -0.01em;
`

const TipText = styled.p`
	margin: 0;
	font-size: 14px;
	line-height: 1.6;
	color: ${theme.inkSoft};
	font-weight: 300;
`

const DrawerFooter = styled.div`
	margin-top: 22px;
	padding: 12px 14px;
	border-radius: ${theme.radiusSm};
	border: 1px dashed ${theme.lineStrong};
	background: rgba(255, 255, 255, 0.55);
	font-size: 13px;
	line-height: 1.55;
	color: ${theme.inkSoft};
	text-align: center;
	font-weight: 300;
`

const DrawerTitleRow = styled.span`
	display: inline-flex;
	align-items: center;
	gap: 8px;
	font-weight: 700;
`

const HelpWrap = styled.div`
	text-align: right;

	@media (max-width: 900px) {
		width: 100%;
		text-align: left;
	}
`

export const Notice = () => {
	const [open, setOpen] = useState(false)

	return (
		<>
			<HelpWrap>
				<HelpButton onClick={() => setOpen(true)}>
					<span aria-hidden>📖</span>
					사용법 보기
				</HelpButton>
			</HelpWrap>
			<Drawer
				title={
					<DrawerTitleRow>
						<span aria-hidden>🍱</span>
						밥먹자 사용법
					</DrawerTitleRow>
				}
				placement="right"
				onClose={() => setOpen(false)}
				open={open}
				width={Math.min(
					420,
					typeof window !== 'undefined' ? window.innerWidth * 0.92 : 420,
				)}
				styles={{
					header: {
						fontFamily: theme.fontDisplay,
						fontWeight: theme.fontWeightBold,
						borderBottom: `1px solid ${theme.line}`,
					},
					body: {
						background: theme.paper,
					},
				}}
			>
				<DrawerIntro>🍚 한 달 식대, 쉽게 챙겨요!</DrawerIntro>
				<TipList>
					{HELP_SECTIONS.map(section => (
						<TipCard key={section.title} $tone={section.tone}>
							<TipEmoji aria-hidden>{section.emoji}</TipEmoji>
							<TipBody>
								<TipTitle>{section.title}</TipTitle>
								<TipText>{section.body}</TipText>
							</TipBody>
						</TipCard>
					))}
				</TipList>
			</Drawer>
		</>
	)
}
