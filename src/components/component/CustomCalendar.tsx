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
import { getHoliday, normalizeHolidayItems } from '../../api'
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
import { theme } from '../../styles/theme'

/** 달력 칸 하단(태그·상태) 영역 높이 — StyledCalendar·CalendarCellSlot과 동일하게 유지 */
const CALENDAR_CELL_CONTENT_HEIGHT_PX = 80

const StyledCalendar = styled(Calendar)`
	border-radius: ${theme.radiusSm};
	overflow: hidden;
	background: rgba(255, 255, 255, 0.55);
	border: 1px solid ${theme.line};
	box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
	font-family: ${theme.fontBody};
	padding: 10px;

	.ant-picker-panel {
		background: transparent !important;
		border: none !important;
	}

	.ant-picker-body {
		padding: 4px 2px 8px !important;
	}

	.ant-picker-content table {
		width: 100%;
		border-collapse: separate;
		border-spacing: 4px;
	}

	.ant-picker-content thead > tr > th {
		background: transparent !important;
		border: none !important;
		padding: 10px 4px !important;
		font-family: ${theme.fontBody} !important;
		font-size: 12px !important;
		font-weight: 700 !important;
		letter-spacing: 0.08em !important;
		color: ${theme.inkSoft} !important;
		text-transform: uppercase;
	}

	.ant-picker-content thead > tr > th:nth-child(1) {
		color: ${theme.accent} !important;
	}

	.ant-picker-content thead > tr > th:nth-child(7) {
		color: ${theme.teal} !important;
	}

	.ant-picker-content tbody tr .ant-picker-cell:nth-child(1),
	.ant-picker-content tbody tr .ant-picker-cell:nth-child(7) {
		background: ${theme.weekend} !important;
	}

	.ant-picker-cell {
		padding: 0 !important;
		border-radius: 14px !important;
		overflow: hidden !important;
		vertical-align: top !important;
		background: rgba(255, 255, 255, 0.72) !important;
		border: 1px solid ${theme.line} !important;
		transition:
			background-color 0.18s ease,
			border-color 0.18s ease,
			transform 0.15s ease,
			box-shadow 0.18s ease;
	}

	.ant-picker-cell:not(.ant-picker-cell-disabled):hover {
		background: #fff !important;
		border-color: rgba(15, 143, 130, 0.35) !important;
		box-shadow: 0 8px 18px rgba(20, 35, 28, 0.08);
		transform: translateY(-1px);
	}

	.ant-picker-content
		tbody
		tr
		.ant-picker-cell:nth-child(1):not(.ant-picker-cell-disabled):hover,
	.ant-picker-content
		tbody
		tr
		.ant-picker-cell:nth-child(7):not(.ant-picker-cell-disabled):hover {
		background: #e8eef6 !important;
	}

	.ant-picker-cell-today {
		overflow: visible !important;
		border-color: ${theme.accent} !important;
		box-shadow: inset 0 0 0 1.5px ${theme.accent} !important;
	}

	.ant-picker-cell-today:not(.ant-picker-cell-disabled):hover {
		background: #fff !important;
		box-shadow:
			inset 0 0 0 1.5px ${theme.accent},
			0 8px 18px rgba(255, 90, 54, 0.12) !important;
	}

	.ant-picker-cell:hover .ant-picker-calendar-date {
		background: transparent !important;
	}

	.ant-picker-cell-disabled {
		opacity: 0.42 !important;
		background: rgba(20, 35, 28, 0.03) !important;
		box-shadow: none !important;
	}

	.ant-picker-cell-inner {
		border-radius: 14px !important;
		width: 100% !important;
		box-sizing: border-box !important;
		padding: 8px 8px 2px !important;
		font-family: ${theme.fontMono} !important;
		font-weight: 600 !important;
		font-size: 16px !important;
		color: ${theme.ink} !important;
		background: transparent !important;
		min-height: auto !important;
	}

	.ant-picker-calendar-date.ant-picker-calendar-date-today {
		position: relative !important;
	}

	.ant-picker-calendar-date.ant-picker-calendar-date-today::after {
		content: 'TODAY';
		position: absolute;
		top: 6px;
		right: 6px;
		z-index: 2;
		font-family: ${theme.fontBody};
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: #fff;
		background: ${theme.accent};
		padding: 2px 6px;
		border-radius: 8px;
		pointer-events: none;
	}

	.ant-picker-calendar-date {
		border-top: none !important;
		margin: 0 !important;
		padding: 0 !important;
		width: 100% !important;
		box-sizing: border-box !important;
		border-radius: 14px !important;
	}

	.ant-picker-calendar-date-content {
		height: ${CALENDAR_CELL_CONTENT_HEIGHT_PX}px !important;
		min-height: ${CALENDAR_CELL_CONTENT_HEIGHT_PX}px !important;
		overflow: hidden !important;
		padding: 0 !important;
		width: 100% !important;
		box-sizing: border-box !important;
		border-radius: 0 0 14px 14px !important;
	}

	.ant-picker-calendar .ant-tag {
		border-radius: 8px !important;
		font-family: ${theme.fontBody} !important;
		font-size: 11px !important;
		font-weight: 700 !important;
		letter-spacing: 0.02em;
		padding: 1px 8px !important;
		border: 1px solid rgba(15, 143, 130, 0.25) !important;
		background: ${theme.tealSoft} !important;
		color: ${theme.teal} !important;
		box-shadow: none;
		margin: 0 !important;
	}

	.ant-picker-calendar-date-content .ant-tag {
		margin-inline: 0 !important;
	}
`

const StyledHolidayP = styled.p`
	margin: 0;
	width: 100%;
	text-align: center;
	font-family: ${theme.fontBody};
	font-size: 12px;
	font-weight: 700;
	line-height: 1.35;
	color: ${theme.accent};
`

type CuteCellTone = 'plain' | 'weekend' | 'holiday' | 'muted'

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
	font-family: ${theme.fontBody};
	font-size: 12px;
	font-weight: 600;
	line-height: 1.3;
	color: ${theme.ink};
	cursor: ${p => (p.$click ? 'pointer' : 'default')};
	border-radius: 0;
	background: ${p => {
		switch (p.$tone) {
			case 'holiday':
				return theme.holiday
			case 'weekend':
				return 'transparent'
			case 'muted':
				return 'rgba(20, 35, 28, 0.04)'
			default:
				return 'transparent'
		}
	}};
	transition: transform 0.12s ease;

	${p =>
		p.$click &&
		`
		&:active {
			transform: scale(0.98);
		}
	`}
`

const CuteResetButton = styled(Button)`
	height: 48px !important;
	border-radius: 14px !important;
	font-family: ${theme.fontBody} !important;
	font-size: 15px !important;
	font-weight: 700 !important;
	letter-spacing: 0.02em !important;
	border: none !important;
	background: ${theme.ink} !important;
	color: #fff !important;
	box-shadow: 0 12px 28px rgba(20, 35, 28, 0.18) !important;
	transition:
		transform 0.15s ease,
		background 0.15s ease !important;

	&:hover {
		background: ${theme.accent} !important;
		color: #fff !important;
		transform: translateY(-1px);
	}

	&:active {
		transform: translateY(0);
	}
`

const CalendarRoot = styled.div`
	position: relative;
	height: 100%;
	min-height: 420px;
	display: flex;
	flex-direction: column;
`

const MonthTitleBar = styled.div`
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	margin-bottom: 14px;
	padding: 4px 2px 10px;
	border-bottom: 1px solid ${theme.line};

	h1 {
		margin: 0;
		font-family: ${theme.fontDisplay};
		font-size: clamp(1.45rem, 2.4vw, 1.85rem);
		font-weight: 400;
		letter-spacing: -0.02em;
		color: ${theme.ink};
		line-height: 1.15;
	}

	span {
		font-family: ${theme.fontBody};
		font-size: 0.85rem;
		font-weight: 600;
		color: ${theme.teal};
		background: ${theme.tealSoft};
		padding: 6px 12px;
		border-radius: 10px;
	}
`

const CalendarBody = styled.div`
	flex: 1;
	min-height: 320px;
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
			const now = dayjs()
			const nextMonth = now.add(1, 'month')
			let nowHoliday: HolidayObj[] = []
			let nextHoliday: HolidayObj[] = []

			try {
				const [response, nextMonthResponse] = await Promise.all([
					getHoliday(now.format('YYYY'), now.format('MM')),
					getHoliday(nextMonth.format('YYYY'), nextMonth.format('MM')),
				])

				nowHoliday = normalizeHolidayItems(response).map(holiday => ({
					locdate: holiday.locdate.toString(),
					dateName: holiday.dateName.toString(),
				}))
				nextHoliday = normalizeHolidayItems(nextMonthResponse).map(
					holiday => ({
						locdate: holiday.locdate.toString(),
						dateName: holiday.dateName.toString(),
					}),
				)
			} catch (error) {
				console.error('공휴일 API 실패 — 달력은 휴일 없이 표시합니다.', error)
			}

			const copy = cloneDeep(workdayStatus)
			copy.holidayList = nowHoliday
			copy.nextMonthHolidayList = nextHoliday

			const workday = getWeekdaysInMonth(nowHoliday)
			const remaningWorkday = getRemainingWorkdays(nowHoliday)
			copy.workday = workday
			copy.workRemaningDay = remaningWorkday

			// 오늘 이후인 기념일만 남기고 나머지는 삭제한다.
			copy.specialDayList = workdayStatus.specialDayList.filter(item => {
				const itemDate = dayjs(item.locdate)
				return itemDate.isAfter(dayjs())
			})

			dispatch(setWorkday(copy))
			// API 실패해도 달력 UI는 반드시 보여준다
			setFetchStatus(true)
		}
		void fetchHoliday()
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
						<h1>{dayjs().month() + 1}월 식대 달력</h1>
						<span>이번 달만</span>
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
							처음부터 다시
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
