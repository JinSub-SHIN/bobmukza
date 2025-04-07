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
	SyncOutlined,
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
import { cloneDeep } from 'lodash'
import { numberWithCommas } from '../hook/useNumberComma'

const StyledCalendar = styled(Calendar)`
	.ant-picker-calendar-date-content {
		height: 120px !important;
		overflow-y: hidden !important;
	}

	.ant-picker-calendar .ant-picker-content thead th:nth-child(6) {
		color: red !important;
	}

	/* 일요일 - 7번째 */
	.ant-picker-calendar .ant-picker-content thead th:nth-child(7) {
		color: red !important;
	}

	padding-top: 25px;
`

const StyledHolidayP = styled.p`
	color: red;
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
			content: '당일 및 이전 지출 계획은 등록 안되요!',
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

				const copy = cloneDeep(workdayStatus)
				copy.holidayList = nowHoliday
				copy.nextMonthHolidayList = nextHoliday

				const workday = getWeekdaysInMonth()
				const remaningWorkday = getRemainingWorkdays()

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
		const {
			token: { colorTextTertiary },
		} = theme.useToken()

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

		// 이번달에 공휴일인 경우
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

		// 다음달에 공휴일인 경우
		if (nextMonthHolidayName) {
			return (
				<div
					style={{
						color: colorTextTertiary,
						textAlign: 'center',
						height: '100px',
						lineHeight: '100px',
					}}
				>
					<StyledHolidayP>{nextMonthHolidayName}</StyledHolidayP>
				</div>
			)
		}

		// 주말인 경우
		if (isWeekend) {
			if (value.month() === dayjs().month()) {
				return (
					<div style={{ color: 'red' }}>
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
					</div>
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
						title="얼마짜리 먹을 계획이야?"
						description={
							<Input
								placeholder="금액입력"
								variant="underlined"
								style={{ padding: 0 }}
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
						open={value.format('YYYY-MM-DD') === calendarSellKey}
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
								<Tag icon={<SyncOutlined spin />} color="processing">
									예정 : {numberWithCommas(speicalDay.amount)}원
								</Tag>
							</div>
						)}
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
		setCalendarSellKey('')
		setConfirmTemporaryData('')
		setInputTemporaryData('')
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
		dispatch(workdayReset())
		setFetchStatus(false)
		setConfirmTemporaryData('')
		setInputTemporaryData('')
		setReFetchStatus(refetchStatus + 1)
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
					<Button
						ref={hiddenRef2}
						onClick={error2}
						style={{ visibility: 'hidden' }}
					>
						Error
					</Button>
				</>
			)}
		</>
	)
}
