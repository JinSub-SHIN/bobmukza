import type { CalendarProps, MenuProps } from 'antd'
import { Calendar, Dropdown, Skeleton, theme } from 'antd'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import locale from 'antd/es/calendar/locale/ko_KR'
import { useEffect, useState } from 'react'
import { getHoliday } from '../../api'
import {
	DislikeOutlined,
	FrownOutlined,
	HomeOutlined,
	LaptopOutlined,
	MehOutlined,
} from '@ant-design/icons'
import styled from 'styled-components'

const StyledCalendar = styled(Calendar)`
	.ant-picker-calendar-date-content {
		height: 120px !important; /* 높이 강제 적용 */
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
	// 휴일 LIST
	const [holidayList, setHolidayList] = useState<
		{ locdate: string; dateName: string }[]
	>([])

	const [fetchStatus, setFetchStatus] = useState<boolean>(false)

	useEffect(() => {
		const fetchHoliday = async () => {
			try {
				const response = await getHoliday('2025', '05')
				setFetchStatus(true)
				const holidayresponseArray = response.response.body.items.item
				// 국가 API
				const locdates = holidayresponseArray.map((holiday: any) => ({
					locdate: holiday.locdate.toString(),
					dateName: holiday.dateName.toString(),
				}))
				return locdates
			} catch (error) {
				// error
			}
		}
		const loadHolidays = async () => {
			const holidays = await fetchHoliday()
			setHolidayList(holidays) // ✅ useState에 직접 저장
		}
		loadHolidays()
	}, [])

	useEffect(() => {
		console.log(holidayList)
	}, [holidayList])

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

	const getMonthData = (value: Dayjs) => {
		if (value.month() === 8) {
			return 1394
		}
	}

	const monthCellRender = (value: Dayjs) => {
		const num = getMonthData(value)
		return num ? (
			<div className="notes-month">
				<section>{num}</section>
				<span>Backlog number</span>
			</div>
		) : null
	}

	const handleMenuClick = (value: Dayjs) => (e: any) => {
		const selectedDate = value.format('YYYY-MM-DD')
		const selectedMenu = e.key
		localStorage.setItem(selectedDate, selectedMenu)
	}

	const dateCellRender = (value: Dayjs) => {
		const {
			token: { colorTextTertiary },
		} = theme.useToken()

		const isWeekend = value.day() === 0 || value.day() === 6

		const holiday = holidayList.find(
			holiday => holiday.locdate === value.format('YYYYMMDD'),
		)

		const workHoliday = value.format('YYYYMMDD') === '20250501'
		const holidayName = holiday ? holiday.dateName : undefined

		const savedMenuKey = localStorage.getItem(value.format('YYYY-MM-DD'))

		console.log(savedMenuKey, '@@@@@')

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
								<StyledHolidayP>근로자의날</StyledHolidayP>
								{savedMenuKey && savedMenuKey !== '휴무' && (
									<StyledP>{savedMenuKey}</StyledP>
								)}
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
								<StyledHolidayP>{holidayName}</StyledHolidayP>
								{savedMenuKey && savedMenuKey !== '휴무' && (
									<StyledP>{savedMenuKey}</StyledP>
								)}
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
								<StyledHolidayP></StyledHolidayP>
								{savedMenuKey && savedMenuKey !== '휴무' && (
									<StyledP>{savedMenuKey}</StyledP>
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
					<div
						style={{
							color: colorTextTertiary,
							textAlign: 'center',
							height: '100px',
							lineHeight: '100px',
						}}
					>
						{savedMenuKey && savedMenuKey !== '근무' && (
							<StyledP>{savedMenuKey}</StyledP>
						)}
					</div>
				</Dropdown>
			)
		}

		return <></>
	}

	const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
		if (info.type === 'date') return dateCellRender(current)
		if (info.type === 'month') return monthCellRender(current)
		return info.originNode
	}

	const disabledDate: CalendarProps<Dayjs>['disabledDate'] = date => {
		const today = dayjs()
		const currentMonth = today.month()
		return date.month() !== currentMonth
	}

	return (
		<div style={{ maxHeight: 500, display: 'flex' }}>
			{!fetchStatus ? (
				<Skeleton.Node active={true} style={{ width: '100%' }} />
			) : (
				<StyledCalendar
					cellRender={cellRender}
					disabledDate={disabledDate}
					headerRender={() => <></>}
					locale={locale}
				/>
			)}
		</div>
	)
}
