import { Button, Drawer } from 'antd'
import { useState } from 'react'
import styled from 'styled-components'

const DrawerInner = styled.div`
	padding: 10px;
	font-size: 15px;
`

const DrawerFooter = styled.div`
	position: absolute;
	bottom: 0;
	font-size: 7px;
	padding: 10px;
`

export const Notice = () => {
	const [open, setOpen] = useState(false)

	const showDrawer = () => {
		setOpen(true)
	}

	const onClose = () => {
		setOpen(false)
	}

	return (
		<>
			<Button onClick={showDrawer} style={{ marginBottom: 10 }}>
				사용법이 궁금하다면 ?
			</Button>
			<Drawer
				title="🍕🍟🌭🍖🍙🍕🍟🌭🍖🍙"
				placement="left"
				onClose={onClose}
				open={open}
				width={'30vw'}
			>
				<DrawerInner>
					* 하단 입력창에 금액을 입력하면 잔액 및 남은 평균 일수 동안 얼마짜리를
					먹을 수 있는지 알 수 있어요.
				</DrawerInner>
				<DrawerInner>
					* 달력에 클릭하여, 미리 지출할 금액을 입력할 수 있어요.
				</DrawerInner>
				<DrawerInner>
					* 달력에 우클릭하여, 연차/야근식대/주말출근 등을 선택하여 추가 계산 할
					수 있어요.
				</DrawerInner>
				<DrawerInner>
					* 남은 근무일수는 점심먹기 전이라면 근무일수로, 점심을 먹은 뒤라면
					근무일수에서 제외되요.
				</DrawerInner>
				<DrawerInner>
					* 오전 반차의 경우에도 점심식사를 하지 않으므로, 근무일수에서
					제외되요.
				</DrawerInner>
				<DrawerInner>
					* 달력에 근무, 주말 휴무는 기본값으로 표시되지 않아요.
				</DrawerInner>
				<DrawerInner>
					* 너무 많은 데이터를 관리하지 않도록 해당 월만 확인되요.
				</DrawerInner>
				<DrawerFooter>
					* 해당 데이터는 참고용일뿐, 실데이터는 고위드 및 엑셀을 참고해주세요.
				</DrawerFooter>
			</Drawer>
		</>
	)
}
