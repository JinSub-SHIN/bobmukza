import type { CalendarProps, InputRef, MenuProps } from 'antd'
import {
	Button,
	Calendar,
	Dropdown,
	Input,
	message,
	Popconfirm,
	Skeleton,
	Tag,
} from 'antd'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import locale from 'antd/es/calendar/locale/ko_KR'
import { useEffect, useRef, useState } from 'react'
import { getHoliday } from '../../api'
import {
	CheckOutlined,
	CloseOutlined,
	DislikeOutlined,
	FrownOutlined,
	HomeOutlined,
	LaptopOutlined,
	MehOutlined,
} from '@ant-design/icons'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import {
	HolidayObj,
	setWorkday,
	SpecialDay,
	workdayReset,
} from '../../store/action/workdaySlice'
import { RootState } from '../../store'
import {
	calendarReset,
	setCalendarUpdate,
} from '../../store/action/calendarSlice'
import { numberRegexp } from '../hook/useNumberRegexp'
import { cloneDeep } from 'lodash'
import { numberWithCommas } from '../hook/useNumberComma'

/** 달력 칸 하단(태그·상태) 영역 높이 — StyledCalendar·CalendarCellSlot과 동일하게 유지 */
const CALENDAR_CELL_CONTENT_HEIGHT_PX = 80

const StyledCalendar = styled(Calendar)`
	border-radius: 0;
	overflow: visible;
	background: transparent;
	border: none;
	box-shadow: none;

	.ant-picker-panel {
		background: transparent !important;
		border: none !important;
	}

	.ant-picker-body {
		padding: 6px 2px 12px !important;
	}

	.ant-picker-content table {
		width: 100%;
		border-collapse: separate;
		border-spacing: 8px;
	}

	.ant-picker-content thead > tr > th {
		background: linear-gradient(180deg, #ffe8f4 0%, #fffafd 100%) !important;
		border: 3px solid #ffc8e4 !important;
		border-radius: 0 !important;
		padding: 8px 4px !important;
		font-size: 15px !important;
		font-weight: 400 !important;
		color: #c86ba8 !important;
	}

	.ant-picker-content thead > tr > th:nth-child(1),
	.ant-picker-content thead > tr > th:nth-child(7) {
		background: linear-gradient(180deg, #ffd8e0 0%, #fff0f3 100%) !important;
		border-color: #ffb3c6 !important;
		color: #e85d7a !important;
	}

	.ant-picker-content tbody tr .ant-picker-cell:nth-child(1),
	.ant-picker-content tbody tr .ant-picker-cell:nth-child(7) {
		background: #fffafc !important;
	}

	.ant-picker-cell {
		padding: 0 !important;
		border-radius: 12px !important;
		overflow: hidden !important;
		vertical-align: top !important;
		background: #fffffe !important;
		border: 3px solid #f0e0ff !important;
		box-shadow: 0 4px 0 rgba(230, 210, 255, 0.65);
		transition:
			box-shadow 0.15s ease,
			border-color 0.15s ease,
			background-color 0.15s ease;
	}

	.ant-picker-cell:not(.ant-picker-cell-disabled):hover {
		box-shadow:
			0 6px 0 rgba(230, 210, 255, 0.8),
			0 10px 18px rgba(255, 180, 220, 0.22);
		border-color: #e8b4ff !important;
		background: #fffafd !important;
	}

	.ant-picker-content
		tbody
		tr
		.ant-picker-cell:nth-child(1):not(.ant-picker-cell-disabled):hover,
	.ant-picker-content
		tbody
		tr
		.ant-picker-cell:nth-child(7):not(.ant-picker-cell-disabled):hover {
		background: #fff5fb !important;
	}

	/* 오늘: 노란 테두리·배경 제거 — 큰 이모지가 숫자 위로 나와도 잘리지 않게 */
	.ant-picker-cell-today {
		overflow: visible !important;
		border-color: #f0e0ff !important;
		box-shadow: 0 4px 0 rgba(230, 210, 255, 0.65) !important;
	}

	.ant-picker-cell-today:not(.ant-picker-cell-disabled):hover {
		border-color: #e8b4ff !important;
		background: #fffafd !important;
		box-shadow:
			0 6px 0 rgba(230, 210, 255, 0.8),
			0 10px 18px rgba(255, 180, 220, 0.22) !important;
	}

	.ant-picker-content tbody tr .ant-picker-cell:nth-child(1).ant-picker-cell-today:not(.ant-picker-cell-disabled):hover,
	.ant-picker-content tbody tr .ant-picker-cell:nth-child(7).ant-picker-cell-today:not(.ant-picker-cell-disabled):hover {
		background: #fff5fb !important;
	}

	.ant-picker-cell:hover .ant-picker-calendar-date {
		background: transparent !important;
	}

	.ant-picker-cell-disabled {
		opacity: 0.38 !important;
		box-shadow: none !important;
	}

	.ant-picker-cell-inner {
		border-radius: 0 !important;
		width: 100% !important;
		box-sizing: border-box !important;
		padding: 10px 8px 4px !important;
		font-weight: 400 !important;
		font-size: 17px !important;
		color: #8b7eb8 !important;
		background: transparent !important;
		min-height: auto !important;
	}

	/* 오늘: 숫자는 가운데 그대로, 이모지는 덮어씌우듯 절대 배치 */
	.ant-picker-calendar-date.ant-picker-calendar-date-today {
		position: relative !important;
	}

	.ant-picker-calendar-date.ant-picker-calendar-date-today::after {
		content: '🌟';
		position: absolute;
		top: 0;
		left: 50%;
		z-index: 2;
		font-size: 2.35rem;
		line-height: 1;
		pointer-events: none;
		transform: translate(-48%, -6px) rotate(-14deg);
		filter: drop-shadow(0 3px 6px rgba(255, 190, 60, 0.65));
	}

	.ant-picker-calendar-date {
		border-top: none !important;
		margin: 0 !important;
		padding: 0 !important;
		width: 100% !important;
		box-sizing: border-box !important;
		border-radius: 0 !important;
	}

	.ant-picker-calendar-date-content {
		height: ${CALENDAR_CELL_CONTENT_HEIGHT_PX}px !important;
		min-height: ${CALENDAR_CELL_CONTENT_HEIGHT_PX}px !important;
		overflow-y: hidden !important;
		overflow-x: hidden !important;
		padding: 0 !important;
		width: 100% !important;
		box-sizing: border-box !important;
		border-radius: 0 !important;
	}

	.ant-picker-calendar .ant-tag {
		border-radius: 12px !important;
		font-size: 11px !important;
		padding: 2px 8px !important;
		border: none !important;
		font-weight: 400 !important;
		margin: 0 !important;
	}

	.ant-picker-calendar-date-content .ant-tag {
		margin-inline: 0 !important;
	}

	padding-top: 4px;
`

const StyledHolidayP = styled.p`
	margin: 0;
	width: 100%;
	text-align: center;
	font-size: 12px;
	font-weight: 400;
	line-height: 1.35;
	color: #e87092;
`

type CuteCellTone = 'plain' | 'weekend' | 'holiday' | 'muted'

/** 하단 영역 전체를 채우고 태그를 정가운데 (Dropdown·Popconfirm 트리거가 줄어드는 것 방지) */
const CalendarCellSlot = styled.div`
	position: relative;
	width: 100%;
	height: ${CALENDAR_CELL_CONTENT_HEIGHT_PX}px;
	min-height: ${CALENDAR_CELL_CONTENT_HEIGHT_PX}px;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;
`

const CuteCellInner = styled.div<{
	$tone?: CuteCellTone
	$click?: boolean
}>`
	flex: 1;
	align-self: stretch;
	min-height: 0;
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	align-content: center;
	justify-content: center;
	gap: 4px;
	padding: 0 6px;
	text-align: center;
	font-size: 13px;
	font-weight: 400;
	line-height: 1.3;
	color: #8b7b99;
	cursor: ${p => (p.$click ? 'pointer' : 'default')};
	border-radius: 0;
	background: ${p => {
		switch (p.$tone) {
			case 'holiday':
				return 'linear-gradient(180deg, transparent 0%, rgba(255, 232, 240, 0.75) 38%, rgba(255, 255, 255, 0.15) 100%)'
			case 'weekend':
				return 'transparent'
			case 'muted':
				return 'linear-gradient(180deg, transparent 0%, rgba(245, 245, 245, 0.65) 55%, transparent 100%)'
			default:
				return 'transparent'
		}
	}};
	transition: transform 0.1s ease;

	${p =>
		p.$click &&
		`
		&:active {
			transform: scale(0.97);
		}
	`}
`

const CuteResetButton = styled(Button)`
	height: 50px !important;
	border-radius: 999px !important;
	font-size: 18px !important;
	font-weight: 400 !important;
	border: 3px solid #f5a8cc !important;
	background: linear-gradient(180deg, #ffc9e3 0%, #ff9ec8 100%) !important;
	color: #fff !important;
	text-shadow: 0 1px 0 rgba(210, 90, 140, 0.35);
	box-shadow:
		0 6px 0 #e878a8,
		0 10px 20px rgba(255, 130, 180, 0.35) !important;

	&:hover {
		background: linear-gradient(180deg, #ffd4eb 0%, #ffb0d6 100%) !important;
		color: #fff !important;
		border-color: #f5a8cc !important;
	}

	&:active {
		transform: translateY(3px);
		box-shadow:
			0 3px 0 #e878a8,
			0 6px 12px rgba(255, 130, 180, 0.3) !important;
	}
`

/** 부모 PaneInner와 높이 맞춤: 헤더·달력·버튼을 세로 flex로 배치 */
const CalendarRoot = styled.div`
	position: relative;
	height: 100%;
	min-height: 0;
	display: flex;
	flex-direction: column;
`

const MonthTitleBar = styled.div`
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 12px;
	padding: 12px 28px;
	border-radius: 999px;
	background: linear-gradient(
		95deg,
		#ffd6ec 0%,
		#fff3b8 28%,
		#c8f7e4 55%,
		#c9e8ff 100%
	);
	border: 4px solid #fff;
	box-shadow:
		0 5px 0 #f8b4d9,
		0 10px 24px rgba(255, 160, 200, 0.25);

	h1 {
		margin: 0;
		font-size: 1.85rem;
		font-weight: 400;
		letter-spacing: 0.03em;
		color: #b565c8;
		text-shadow:
			1px 1px 0 #fff,
			2px 2px 0 rgba(255, 200, 230, 0.8);
	}
`

const CalendarBody = styled.div`
	flex: 1;
	min-height: 0;
	overflow: auto;
	padding-right: 2px;
`

const CalendarFooter = styled.div`
	flex-shrink: 0;
	margin-top: 12px;
`

export const CustomCalendar = () => {
	const dispatch = useDispatch()
	const workdayStatus = useSelector((state: RootState) => state.workdayStatus)
	const calendarStatus = useSelector((state: RootState) => state.calendarStatus)

	const [fetchStatus, setFetchStatus] = useState<boolean>(false)
	const [refetchStatus, setReFetchStatus] = useState(0)

	const [confirmTemporaryData, setConfirmTemporaryData] = useState<string>()
	const [inputTemporaryData, setInputTemporaryData] = useState<
		number | string
	>()

	const [messageApi, contextHolder] = message.useMessage()

	const hiddenRef = useRef(null)
	const hiddenRef2 = useRef(null)
	const inputRef = useRef<InputRef>(null)
	const storageMonth = localStorage.getItem('userCalendar')

	const [calendarSellKey, setCalendarSellKey] = useState('')

	const error = () => {
		messageApi.open({
			type: 'error',
			content: '잘못 입력했어요! (숫자인지, 동일한 값이 아닌지 확인)',
		})
	}

	const error2 = () => {
		messageApi.open({
			type: 'error',
			content: (
				<div>
					<p>당일 및 이전 지출 계획은 등록 안되요!</p>
					<p>지출한 금액은 고위드 이용금액 입력란에 적어주세요.</p>
				</div>
			),
		})
	}

	useEffect(() => {
		const nowDate = (dayjs().month() + 1).toString()
		if (storageMonth !== nowDate) {
			handleReset()
		}
	}, [])

	useEffect(() => {
		const fetchHoliday = async () => {
			try {
				const now = dayjs()
				const nextMonth = now.add(1, 'month')

				// API 고장으로 인한 임시 데이터 (11월 휴일 없음)
				const response = await getHoliday(now.format('YYYY'), now.format('MM'))
				const nextMonthResponse = await getHoliday(
					nextMonth.format('YYYY'),
					nextMonth.format('MM'),
				)

				// 임시 데이터: 11월 휴일 없음
				let holidayresponseArray = response.response.body.items.item
					? response.response.body.items.item
					: []
				let holidayNextresponseArray = nextMonthResponse.response.body.items
					.item
					? nextMonthResponse.response.body.items.item
					: []

				// api 에서 반환된 값이 1개 일때는 객채로 오므로,
				// 배열로 변환해준다.
				holidayresponseArray = Array.isArray(holidayresponseArray)
					? holidayresponseArray
					: [holidayresponseArray]

				// api 에서 반환된 값이 1개 일때는 객채로 오므로,
				// 배열로 변환해준다.
				holidayNextresponseArray = Array.isArray(holidayNextresponseArray)
					? holidayNextresponseArray
					: [holidayNextresponseArray]

				setFetchStatus(true)

				const nowHoliday = holidayresponseArray.map((holiday: any) => ({
					locdate: holiday.locdate.toString(),
					dateName: holiday.dateName.toString(),
				}))

				const nextHoliday = holidayNextresponseArray.map((holiday: any) => ({
					locdate: holiday.locdate.toString(),
					dateName: holiday.dateName.toString(),
				}))

				const copy = cloneDeep(workdayStatus)
				copy.holidayList = nowHoliday
				copy.nextMonthHolidayList = nextHoliday

				const workday = getWeekdaysInMonth(nowHoliday)
				const remaningWorkday = getRemainingWorkdays(nowHoliday)
				copy.workday = workday
				copy.workRemaningDay = remaningWorkday

				// 오늘 이후인 기념일만 남기고 나머지는 삭제한다.
				const filtered = workdayStatus.specialDayList.filter(item => {
					const itemDate = dayjs(item.locdate)
					return itemDate.isAfter(dayjs())
				})

				copy.specialDayList = filtered

				dispatch(setWorkday(copy))
			} catch (error) {
				return []
			}
		}
		const loadHolidays = async () => {
			await fetchHoliday()
		}
		loadHolidays()
	}, [refetchStatus])

	useEffect(() => {
		const today = dayjs()
		const afterAllHolidaycount = calendarStatus.filter(
			item => item.status === '휴가' && dayjs(item.date).isAfter(today, 'day'),
		).length

		const afterMorningHolidaycount = calendarStatus.filter(
			item =>
				item.status === '오전반차' && dayjs(item.date).isAfter(today, 'day'),
		).length

		const allHolidayCount = calendarStatus.filter(
			item => item.status === '휴가',
		).length

		const morningHolidayCount = calendarStatus.filter(
			item => item.status === '오전반차',
		).length

		const overtimeDontEatCount = calendarStatus.filter(
			item => item.status === '야근(밥x)',
		).length
		const overtimeCount = calendarStatus.filter(
			item => item.status === '야근(밥)',
		).length
		const extraLunchCount = calendarStatus.filter(
			item => item.status === '점심',
		).length
		const extraLunchDinnerCount = calendarStatus.filter(
			item => item.status === '점심/저녁',
		).length

		const copy = { ...workdayStatus }
		copy.extraWorkCount =
			overtimeDontEatCount +
			overtimeCount +
			extraLunchCount +
			extraLunchDinnerCount

		copy.allHolidayCount = allHolidayCount
		copy.morningHoldayCount = morningHolidayCount
		copy.afterTodayAllHolidayCount = afterAllHolidaycount
		copy.afterTodayMorningHoldayCount = afterMorningHolidaycount
		copy.extraMoneyCount =
			overtimeCount + extraLunchCount + extraLunchDinnerCount * 2
		copy.holidayTotalCount = allHolidayCount + morningHolidayCount
		copy.afterTodayHolidayCount =
			afterAllHolidaycount + afterMorningHolidaycount

		dispatch(setWorkday(copy))
	}, [calendarStatus])

	const getWeekdaysInMonth = (holidayList: HolidayObj[]) => {
		const now = dayjs()
		const daysInMonth = now.daysInMonth()
		let count = 0

		for (let day = 1; day <= daysInMonth; day++) {
			const date = now.date(day)
			const dayOfWeek = date.day()
			const isHoliday = holidayList.some(
				holiday => holiday.locdate === date.format('YYYYMMDD'),
			)
			if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isHoliday) {
				count++
			}
		}
		if (now.format('MM') === '05') {
			count--
		}

		return count
	}

	const getRemainingWorkdays = (holidayList: HolidayObj[]) => {
		const now = dayjs()
		const isBefore1PM = now.hour() < 13
		const year = now.format('YYYY')
		const month = now.format('MM')
		const daysInMonth = now.daysInMonth()
		let count = 0
		for (let day = now.date(); day <= daysInMonth; day++) {
			const date = dayjs(`${year}-${month}-${String(day).padStart(2, '0')}`)
			const dayOfWeek = date.day()
			const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
			const isHoliday = holidayList.some(
				holiday => holiday.locdate === date.format('YYYYMMDD'),
			)
			if (day === now.date()) {
				if (!isWeekend && !isHoliday && isBefore1PM) {
					count++
				}
			} else {
				if (!isWeekend && !isHoliday) {
					count++
				}
			}
		}
		return count
	}

	const workDayItems: MenuProps['items'] = [
		{
			label: '근무',
			key: '근무',
			icon: <LaptopOutlined />,
		},
		{
			label: '휴가',
			key: '휴가',
			icon: <HomeOutlined />,
		},
		{
			label: '오전반차',
			key: '오전반차',
			icon: <HomeOutlined />,
		},
		{
			label: '야근(밥x)',
			key: '야근(밥x)',
			icon: <MehOutlined />,
			danger: true,
		},
		{
			label: '야근(밥)',
			key: '야근(밥)',
			icon: <MehOutlined />,
			danger: true,
		},
	]

	const holidayItems: MenuProps['items'] = [
		{
			label: '휴무',
			key: '휴무',
			icon: <HomeOutlined />,
		},
		{
			label: '점심',
			key: '점심',
			icon: <FrownOutlined />,
			danger: true,
		},
		{
			label: '점심/저녁',
			key: '점심/저녁',
			icon: <DislikeOutlined />,
			danger: true,
		},
	]

	const handleMenuClick = (value: Dayjs) => (e: any) => {
		const selectedDate = value.format('YYYY-MM-DD')
		const selectedMenu = e.key
		const updatedItem = { date: selectedDate, status: selectedMenu }

		const copy = cloneDeep(workdayStatus)

		// 기념일이 있었다면 기념일 삭제
		const existingIndex = workdayStatus.specialDayList.findIndex(
			item => item.locdate === selectedDate,
		)

		if (existingIndex !== -1) {
			copy.specialDayList.splice(existingIndex, 1)
		}

		dispatch(setWorkday(copy))
		dispatch(setCalendarUpdate(updatedItem))
	}

	const handleOpenChange = (open: boolean, value: string) => {
		setCalendarSellKey(value)
		if (open) {
			setTimeout(() => {
				inputRef.current?.focus()
			}, 0)
		}
	}

	const dateCellRender = (value: Dayjs) => {
		const isWeekend = value.day() === 0 || value.day() === 6

		const holiday = workdayStatus.holidayList.find(
			holiday => holiday.locdate === value.format('YYYYMMDD'),
		)

		const nextMonthHoliday = workdayStatus.nextMonthHolidayList.find(
			holiday => holiday.locdate === value.format('YYYYMMDD'),
		)

		const speicalDay = workdayStatus.specialDayList.find(
			specialDay => specialDay.locdate === value.format('YYYY-MM-DD'),
		)

		const workHoliday = value.format('YYYYMMDD') === '20250501'
		const holidayName = holiday ? holiday.dateName : undefined
		const nextMonthHolidayName = nextMonthHoliday
			? nextMonthHoliday.dateName
			: undefined

		const savedMenuKey = calendarStatus.find(
			item => item.date === value.format('YYYY-MM-DD'),
		)?.status

		// 근로자의날인경우
		if (workHoliday) {
			if (value.month() === dayjs().month()) {
				return (
					<>
						<Dropdown
							menu={{ items: holidayItems, onClick: handleMenuClick(value) }}
							trigger={['contextMenu']}
						>
							<CalendarCellSlot>
								<CuteCellInner $tone="holiday">
									<StyledHolidayP>
										근로자의날
										{savedMenuKey && savedMenuKey !== '휴무' && (
											<Tag color="magenta">({savedMenuKey})</Tag>
										)}
									</StyledHolidayP>
								</CuteCellInner>
							</CalendarCellSlot>
						</Dropdown>
					</>
				)
			}

			return (
				<CalendarCellSlot>
					<CuteCellInner $tone="holiday">
						<StyledHolidayP>근로자의날</StyledHolidayP>
					</CuteCellInner>
				</CalendarCellSlot>
			)
		}

		// 이번달에 공휴일인 경우
		if (holidayName) {
			if (value.month() === dayjs().month()) {
				return (
					<>
						<Dropdown
							menu={{ items: holidayItems, onClick: handleMenuClick(value) }}
							trigger={['contextMenu']}
						>
							<CalendarCellSlot>
								<CuteCellInner $tone="holiday">
									<StyledHolidayP>
										{holidayName}
										{savedMenuKey && savedMenuKey !== '휴무' && (
											<Tag color="magenta">({savedMenuKey})</Tag>
										)}
									</StyledHolidayP>
								</CuteCellInner>
							</CalendarCellSlot>
						</Dropdown>
					</>
				)
			}
			return (
				<CalendarCellSlot>
					<CuteCellInner $tone="holiday">
						<StyledHolidayP>{holidayName}</StyledHolidayP>
					</CuteCellInner>
				</CalendarCellSlot>
			)
		}

		// 다음달에 공휴일인 경우
		if (nextMonthHolidayName) {
			return (
				<CalendarCellSlot>
					<CuteCellInner $tone="muted">
						<StyledHolidayP style={{ color: '#aaa0b8' }}>
							{nextMonthHolidayName}
						</StyledHolidayP>
					</CuteCellInner>
				</CalendarCellSlot>
			)
		}

		// 주말인 경우
		if (isWeekend) {
			if (value.month() === dayjs().month()) {
				return (
					<>
						<Dropdown
							menu={{ items: holidayItems, onClick: handleMenuClick(value) }}
							trigger={['contextMenu']}
						>
							<CalendarCellSlot>
								<CuteCellInner $tone="weekend">
									{savedMenuKey && savedMenuKey !== '휴무' && (
										<Tag color="magenta">({savedMenuKey})</Tag>
									)}
								</CuteCellInner>
							</CalendarCellSlot>
						</Dropdown>
					</>
				)
			}

			return <></>
		}

		// 근무일인 경우
		if (value.month() === dayjs().month()) {
			return (
				<Dropdown
					menu={{ items: workDayItems, onClick: handleMenuClick(value) }}
					trigger={['contextMenu']}
				>
					<Popconfirm
						key={value.format('YYYY-MM-DD')}
						title="이날 식비 얼마 쓸 거야? 🍱"
						description={
							<Input
								placeholder="숫자만!"
								size="large"
								style={{
									marginTop: 10,
									borderRadius: 14,
									borderWidth: 2,
									borderColor: '#ffc8e4',
								}}
								onChange={handleInputChange}
								ref={inputRef}
								onPressEnter={() => {
									handleConfirm()
								}}
							/>
						}
						okText={<CheckOutlined />}
						cancelText={<CloseOutlined />}
						trigger="click"
						icon={''}
						onConfirm={handleConfirm}
						onOpenChange={open =>
							handleOpenChange(open, value.format('YYYY-MM-DD'))
						}
						onCancel={() => {
							setCalendarSellKey('')
						}}
						open={value.format('YYYY-MM-DD') == calendarSellKey}
					>
						<CalendarCellSlot>
							<CuteCellInner
								$tone="plain"
								$click
								onClick={() => handleLeftClick(value)}
								role="presentation"
							>
								{savedMenuKey &&
									savedMenuKey !== '근무' &&
									savedMenuKey !== '휴가' &&
									savedMenuKey !== '오전반차' && (
										<Tag color="orange">({savedMenuKey})</Tag>
									)}
								{(savedMenuKey === '휴가' || savedMenuKey === '오전반차') && (
									<Tag color="cyan">({savedMenuKey})</Tag>
								)}
							</CuteCellInner>
							{/* 기념일이면서, 해당기념일이 오늘 이후인지 확인 */}
							{speicalDay && dayjs(speicalDay.locdate).isAfter(dayjs()) && (
								<div
									style={{
										position: 'absolute',
										bottom: 0,
										right: 0,
										padding: 3,
									}}
								>
									<Tag
										color="geekblue"
										style={{ fontSize: 11, borderRadius: 10 }}
									>
										-{numberWithCommas(speicalDay.amount)}원
									</Tag>
								</div>
							)}
						</CalendarCellSlot>
					</Popconfirm>
				</Dropdown>
			)
		}

		return <></>
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target

		if (value.length === 0) {
			setInputTemporaryData('')
		}

		if (numberRegexp(value) === false) {
			return
		} else {
			if (value.length > 7) {
				return
			}
			setInputTemporaryData(value)
		}
	}

	const handleConfirm = () => {
		const copy = cloneDeep(workdayStatus)

		if (dayjs(confirmTemporaryData).isBefore(dayjs())) {
			;(hiddenRef2.current as any)?.click()
			return
		}

		if (
			isNaN(Number(inputTemporaryData)) ||
			inputTemporaryData?.toString().trim() === ''
		) {
			;(hiddenRef.current as any)?.click()
			return
		}

		const specialObj: SpecialDay = {
			locdate: confirmTemporaryData!,
			amount: Number(inputTemporaryData),
		}
		const existingIndex = copy.specialDayList.findIndex(
			item => item.locdate === confirmTemporaryData,
		)

		if (specialObj.amount === 0) {
			// amount가 0이면 해당 항목 삭제 (있을 때만)
			if (existingIndex !== -1) {
				copy.specialDayList.splice(existingIndex, 1)
			}
		} else {
			// amount가 0이 아니면 추가하거나 수정
			if (existingIndex !== -1) {
				copy.specialDayList[existingIndex].amount = specialObj.amount
			} else {
				copy.specialDayList.push(specialObj)
			}
		}

		dispatch(setWorkday(copy))

		setConfirmTemporaryData('')
		setInputTemporaryData('')

		setTimeout(() => {
			setCalendarSellKey('')
		}, 0)
	}

	const handleLeftClick = (value: Dayjs) => {
		setInputTemporaryData('')
		setConfirmTemporaryData(value.format('YYYY-MM-DD'))
	}

	const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
		if (info.type === 'date') return dateCellRender(current)
		return info.originNode
	}

	const disabledDate: CalendarProps<Dayjs>['disabledDate'] = date => {
		const today = dayjs()
		const currentMonth = today.month()
		return date.month() !== currentMonth
	}

	const handleReset = () => {
		localStorage.setItem('userCalendar', (dayjs().month() + 1).toString())
		dispatch(calendarReset())
		dispatch(workdayReset())
		setFetchStatus(false)
		setConfirmTemporaryData('')
		setInputTemporaryData('')
		setReFetchStatus(refetchStatus + 1)
	}

	return (
		<CalendarRoot>
			{!fetchStatus ? (
				<div
					style={{
						flex: 1,
						minHeight: 0,
						display: 'flex',
					}}
				>
					<Skeleton.Node
						active={true}
						style={{
							width: '100%',
							flex: 1,
							minHeight: 320,
							borderRadius: 12,
						}}
					/>
				</div>
			) : (
				<>
					{contextHolder}
					<MonthTitleBar>
						<h1>🌈 {dayjs().month() + 1}월 달력 🌈</h1>
					</MonthTitleBar>
					<CalendarBody>
						<StyledCalendar
							cellRender={cellRender}
							disabledDate={disabledDate}
							headerRender={() => <></>}
							locale={locale}
						/>
					</CalendarBody>
					<CalendarFooter>
						<CuteResetButton block type="primary" onClick={handleReset}>
							🔄 처음부터 다시!
						</CuteResetButton>
					</CalendarFooter>
					<Button
						ref={hiddenRef}
						onClick={error}
						style={{ visibility: 'hidden', position: 'absolute' }}
					>
						Error
					</Button>
					<Button
						ref={hiddenRef2}
						onClick={error2}
						style={{ visibility: 'hidden', position: 'absolute' }}
					>
						Error
					</Button>
				</>
			)}
		</CalendarRoot>
	)
}
