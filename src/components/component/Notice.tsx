import { Button, Drawer } from 'antd'
import { useState } from 'react'
import styled from 'styled-components'
import { theme } from '../../styles/theme'

const HelpButton = styled(Button)`
	height: 44px !important;
	padding: 0 18px !important;
	border-radius: 12px !important;
	border: 1px solid ${theme.lineStrong} !important;
	background: rgba(255, 255, 255, 0.72) !important;
	color: ${theme.ink} !important;
	font-family: ${theme.fontBody} !important;
	font-weight: 600 !important;
	box-shadow: 0 8px 20px rgba(20, 35, 28, 0.06) !important;
	backdrop-filter: blur(8px);

	&:hover {
		border-color: ${theme.accent} !important;
		color: ${theme.accent} !important;
		background: #fff !important;
	}
`

const DrawerInner = styled.div`
	padding: 4px 2px 14px;
	font-size: 15px;
	line-height: 1.65;
	color: ${theme.inkSoft};
	font-family: ${theme.fontBody};
`

const DrawerInnerHeader = styled.div`
	font-size: 1.05rem;
	font-weight: 700;
	margin-bottom: 8px;
	color: ${theme.ink};
	font-family: ${theme.fontBody};
	letter-spacing: -0.01em;
`

const DrawerFooter = styled.div`
	margin-top: 24px;
	padding-top: 14px;
	border-top: 1px solid ${theme.line};
	font-size: 12px;
	line-height: 1.5;
	color: ${theme.inkSoft};
`

export const Notice = () => {
	const [open, setOpen] = useState(false)

	return (
		<>
			<div style={{ textAlign: 'right' }}>
				<HelpButton onClick={() => setOpen(true)}>사용법 보기</HelpButton>
			</div>
			<Drawer
				title="밥먹자 사용법"
				placement="right"
				onClose={() => setOpen(false)}
				open={open}
				width={Math.min(420, typeof window !== 'undefined' ? window.innerWidth * 0.92 : 420)}
				styles={{
					header: {
						fontFamily: theme.fontDisplay,
						borderBottom: `1px solid ${theme.line}`,
					},
					body: {
						background: theme.paper,
					},
				}}
			>
				<DrawerInner>
					<DrawerInnerHeader>금액 입력</DrawerInnerHeader>
					하단 입력창에 금액을 입력하면 잔액과, 남은 근무일 기준 하루 평균
					식대를 볼 수 있어요.
				</DrawerInner>
				<DrawerInner>
					<DrawerInnerHeader>클릭</DrawerInnerHeader>
					달력 날짜를 클릭해 미리 쓸 금액을 넣을 수 있어요. 지우려면 0을
					입력하세요.
				</DrawerInner>
				<DrawerInner>
					<DrawerInnerHeader>우클릭</DrawerInnerHeader>
					연차 / 야근식대 / 주말출근 등을 선택해 추가 계산에 반영할 수 있어요.
				</DrawerInner>
				<DrawerInner>
					<DrawerInnerHeader>근무일수</DrawerInnerHeader>
					점심 전이면 당일을 근무일로 보고, 점심 후면 제외해요. 오전반차도
					점심을 안 먹으므로 제외됩니다.
				</DrawerInner>
				<DrawerInner>
					<DrawerInnerHeader>달력 표시</DrawerInnerHeader>
					근무·주말 휴무는 기본으로 표시하지 않아요. 이번 달만 관리합니다.
				</DrawerInner>
				<DrawerFooter>
					* 참고용입니다. 실데이터는 고위드·엑셀을 기준으로 하세요.
				</DrawerFooter>
			</Drawer>
		</>
	)
}
