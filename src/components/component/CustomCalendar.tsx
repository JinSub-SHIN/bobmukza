import type { CalendarProps, MenuProps } from 'antd'
import {
	Button,
	Calendar,
	Dropdown,
	Input,
	message,
	Popconfirm,
	Skeleton,
	Tag,
	theme,
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
	QuestionOutlined,
} from '@ant-design/icons'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import {
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

const StyledCalendar = styled(Calendar)`
	.ant-picker-calendar-date-content {
		height: 120px !important;
		overflow-y: hidden !important;
	}

	padding-top: 25px;
`

const StyledP = styled.p`
	color: black;
`

const StyledHolidayP = styled.p`
	color: red;
`

export const CustomCalendar = () => {
	const dispatch = useDispatch()
	const workdayStatus = useSelector((state: RootState) => state.workdayStatus)
	const calendarStatus = useSelector((state: RootState) => state.calendarStatus)

	const [fetchStatus, setFetchStatus] = useState<boolean>(false)

	const [confirmTemporaryData, setConfirmTemporaryData] = useState<string>()
	const [inputTemporaryData, setInputTemporaryData] = useState<
		number | string
	>()

	const [messageApi, contextHolder] = message.useMessage()

	const hiddenRef = useRef(null)

	const error = () => {
		messageApi.open({
			type: 'error',
			content: '숫자가 아니거나, 동일한 값을 입력했습니다.',
		})
	}

	useEffect(() => {
		const fetchHoliday = async () => {
			try {
				const now = dayjs()
				const nextMonth = now.add(1, 'month')

				const response = await getHoliday(now.format('YYYY'), now.format('MM'))

				const nextMonthResponse = await getHoliday(
					nextMonth.format('YYYY'),
					nextMonth.format('MM'),
				)

				const holidayresponseArray = response.response.body.items.item
					? response.response.body.items.item
					: []
				const holidayNextresponseArray = nextMonthResponse.response.body.items
					.item
					? nextMonthResponse.response.body.items.item
					: []

				setFetchStatus(true)

				const nowHoliday = holidayresponseArray.map((holiday: any) => ({
					locdate: holiday.locdate.toString(),
					dateName: holiday.dateName.toString(),
				}))

				const nextHoliday = holidayNextresponseArray.map((holiday: any) => ({
					locdate: holiday.locdate.toString(),
					dateName: holiday.dateName.toString(),
				}))

				const copy = { ...workdayStatus }
				copy.holidayList = nowHoliday
				copy.nextMonthHolidayList = nextHoliday
				dispatch(setWorkday(copy))
			} catch (error) {
				return []
			}
		}
		const loadHolidays = async () => {
			await fetchHoliday()
			const workday = getWeekdaysInMonth()
			const remaningWorkday = getRemainingWorkdays()
			const copy = { ...workdayStatus }
			copy.workday = workday
			copy.workRemaningDay = remaningWorkday
			dispatch(setWorkday(copy))
		}
		loadHolidays()
	}, [])

	useEffect(() => {
		console.log(workdayStatus, '업데이트확인')
	}, [workdayStatus])

	useEffect(() => {
		const today = dayjs()

		const afterHolidaycount = calendarStatus.filter(
			item =>
				item.status === '휴가/오전반차' &&
				dayjs(item.date).isAfter(today, 'day'),
		).length

		const vacationCount = calendarStatus.filter(
			item => item.status === '휴가/오전반차',
		).length
		const overtimeDontEatCount = calendarStatus.filter(
			item => item.status === '야근(식대x)',
		).length
		const overtimeCount = calendarStatus.filter(
			item => item.status === '야근(식대)',
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

		copy.extraMoneyCount =
			overtimeCount + extraLunchCount + extraLunchDinnerCount * 2
		copy.holidayTotalCount = vacationCount
		copy.afterTodayHolidayCount = afterHolidaycount

		dispatch(setWorkday(copy))
	}, [calendarStatus])

	const getWeekdaysInMonth = () => {
		const now = dayjs()
		const daysInMonth = now.daysInMonth()
		let count = 0
		for (let day = 1; day <= daysInMonth; day++) {
			const date = now.date(day)
			const dayOfWeek = date.day()
			const isHoliday = workdayStatus.holidayList.some(
				holiday => holiday.locdate === date.format('YYYYMMDD'),
			)
			if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isHoliday) {
				count++
			}
		}
		const month = now.format('MM')
		// 근로자의날 특수케이스추가
		if (month === '05') {
			count--
		}
		return count
	}

	const getRemainingWorkdays = () => {
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
			const isHoliday = workdayStatus.holidayList.some(
				holiday => holiday.locdate === date.format('YYYYMMDD'),
			)

			// 오늘이면 시간 확인
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

		// 근로자의날 특수케이스추가
		if (month === '05') {
			count--
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
			label: '휴가/오전반차',
			key: '휴가/오전반차',
			icon: <HomeOutlined />,
		},
		{
			label: '야근(식대x)',
			key: '야근(식대x)',
			icon: <MehOutlined />,
			danger: true,
		},
		{
			label: '야근(식대)',
			key: '야근(식대)',
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
		dispatch(setCalendarUpdate(updatedItem))
	}

	const dateCellRender = (value: Dayjs) => {
		const {
			token: { colorTextTertiary },
		} = theme.useToken()

		const isWeekend = value.day() === 0 || value.day() === 6

		const holiday = workdayStatus.holidayList.find(
			holiday => holiday.locdate === value.format('YYYYMMDD'),
		)

		const workHoliday = value.format('YYYYMMDD') === '20250501'
		const holidayName = holiday ? holiday.dateName : undefined

		const savedMenuKey = calendarStatus.find(
			item => item.date === value.format('YYYY-MM-DD'),
		)?.status

		if (workHoliday) {
			if (value.month() === dayjs().month()) {
				return (
					<>
						<Dropdown
							menu={{ items: holidayItems, onClick: handleMenuClick(value) }}
							trigger={['contextMenu']}
						>
							<div
								style={{
									color: colorTextTertiary,
									textAlign: 'center',
									height: '100px',
									lineHeight: '100px',
								}}
							>
								<StyledHolidayP>
									근로자의날
									{savedMenuKey && savedMenuKey !== '휴무' && (
										<Tag color="volcano"> ({savedMenuKey})</Tag>
									)}
								</StyledHolidayP>
							</div>
						</Dropdown>
					</>
				)
			}

			return (
				<div
					style={{
						color: colorTextTertiary,
						textAlign: 'center',
						height: '100px',
						lineHeight: '100px',
					}}
				>
					<StyledHolidayP>근로자의날</StyledHolidayP>
				</div>
			)
		}

		if (holidayName) {
			if (value.month() === dayjs().month()) {
				return (
					<>
						<Dropdown
							menu={{ items: holidayItems, onClick: handleMenuClick(value) }}
							trigger={['contextMenu']}
						>
							<div
								style={{
									color: colorTextTertiary,
									textAlign: 'center',
									height: '100px',
									lineHeight: '100px',
								}}
							>
								<StyledHolidayP>
									{holidayName}
									{savedMenuKey && savedMenuKey !== '휴무' && (
										<Tag color="volcano"> ({savedMenuKey})</Tag>
									)}
								</StyledHolidayP>
							</div>
						</Dropdown>
					</>
				)
			}
			return (
				<div
					style={{
						color: colorTextTertiary,
						textAlign: 'center',
						height: '100px',
						lineHeight: '100px',
					}}
				>
					<StyledHolidayP>{holidayName}</StyledHolidayP>
				</div>
			)
		}

		if (isWeekend) {
			if (value.month() === dayjs().month()) {
				return (
					<>
						<Dropdown
							menu={{ items: holidayItems, onClick: handleMenuClick(value) }}
							trigger={['contextMenu']}
						>
							<div
								style={{
									color: colorTextTertiary,
									textAlign: 'center',
									height: '100px',
									lineHeight: '100px',
								}}
							>
								{savedMenuKey && savedMenuKey !== '휴무' && (
									<Tag color="volcano"> ({savedMenuKey})</Tag>
								)}
							</div>
						</Dropdown>
					</>
				)
			}

			return <></>
		}

		if (value.month() === dayjs().month()) {
			return (
				<Dropdown
					menu={{ items: workDayItems, onClick: handleMenuClick(value) }}
					trigger={['contextMenu']}
				>
					<Popconfirm
						title="얼마짜리 먹을 계획이야?"
						description={
							<Input
								placeholder="금액입력"
								variant="underlined"
								style={{ padding: 0 }}
								onChange={handleInputChange}
							/>
						}
						okText={<CheckOutlined />}
						cancelText={<CloseOutlined />}
						trigger="click"
						icon={''}
						onConfirm={handleConfirm}
					>
						<div
							style={{
								color: colorTextTertiary,
								textAlign: 'center',
								height: '100px',
								lineHeight: '100px',
							}}
							onClick={() => handleLeftClick(value)}
						>
							{savedMenuKey &&
								savedMenuKey !== '근무' &&
								savedMenuKey !== '휴가/오전반차' && (
									<Tag color="volcano"> ({savedMenuKey})</Tag>
								)}
							{savedMenuKey && savedMenuKey === '휴가/오전반차' && (
								<Tag color="purple"> ({savedMenuKey})</Tag>
							)}
						</div>
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
		const copy = {
			...workdayStatus,
			specialDayList: workdayStatus.specialDayList.map(item => ({ ...item })), // 깊은 복사
		}

		if (
			isNaN(Number(inputTemporaryData)) ||
			inputTemporaryData?.toString().trim() === ''
		) {
			;(hiddenRef.current as any)?.click()
			return
		}

		console.log(copy.specialDayList)

		const specialObj: SpecialDay = {
			locdate: confirmTemporaryData!,
			amount: Number(inputTemporaryData),
		}
		const existingIndex = copy.specialDayList.findIndex(
			item => item.locdate === confirmTemporaryData,
		)

		console.log(existingIndex)

		if (existingIndex !== -1) {
			copy.specialDayList[existingIndex].amount = specialObj.amount
		} else {
			copy.specialDayList.push(specialObj)
		}

		dispatch(setWorkday(copy))
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
		dispatch(calendarReset())
	}

	return (
		<>
			{!fetchStatus ? (
				<Skeleton.Node
					active={true}
					style={{ width: '90vw', height: '100vh' }}
				/>
			) : (
				<>
					{contextHolder}
					<div style={{ textAlign: 'center', marginBottom: 50 }}>
						<h1>{dayjs().month() + 1}월</h1>
					</div>
					<StyledCalendar
						cellRender={cellRender}
						disabledDate={disabledDate}
						headerRender={() => <></>}
						locale={locale}
					/>
					<div style={{ marginTop: 30 }}>
						<Button block style={{ height: 50 }} onClick={handleReset}>
							달력 초기화
						</Button>
					</div>
					<Button
						ref={hiddenRef}
						onClick={error}
						style={{ visibility: 'hidden' }}
					>
						Error
					</Button>
				</>
			)}
		</>
	)
}
