import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface HolidayObj {
	locdate: string
	dateName: string
}

export interface SpecialDay {
	locdate: string
	amount: number
}

export interface Workday {
	workday: number
	workRemaningDay: number
	holidayList: HolidayObj[]
	nextMonthHolidayList: HolidayObj[]
	extraWorkCount: number
	extraMoneyCount: number
	allHolidayCount: number
	morningHoldayCount: number
	afterTodayAllHolidayCount: number
	afterTodayMorningHoldayCount: number
	holidayTotalCount: number
	afterTodayHolidayCount: number
	willPayCount: number
	usageAmount: number | undefined
	specialDayList: SpecialDay[]
	exceptionMoney: number | undefined
}

const initialState: Workday = {
	workday: 0,
	workRemaningDay: 0,
	holidayList: [],
	nextMonthHolidayList: [],
	extraWorkCount: 0,
	extraMoneyCount: 0,
	allHolidayCount: 0,
	morningHoldayCount: 0,
	afterTodayAllHolidayCount: 0,
	afterTodayMorningHoldayCount: 0,
	holidayTotalCount: 0,
	afterTodayHolidayCount: 0,
	willPayCount: 0,
	usageAmount: undefined,
	specialDayList: [],
	exceptionMoney: undefined,
}

const workdaySlice = createSlice({
	name: 'workday',
	initialState,
	reducers: {
		setHolidayList: (state, action: PayloadAction<HolidayObj[]>) => {
			state.holidayList = action.payload
		},
		setNextMonthHolidayList: (state, action: PayloadAction<HolidayObj[]>) => {
			state.nextMonthHolidayList = action.payload
		},
		setWorkday: (_, action: PayloadAction<Workday>) => {
			return { ...action.payload }
		},
		workdayReset: () => {
			return initialState
		},
	},
})

export const {
	setWorkday,
	workdayReset,
	setHolidayList,
	setNextMonthHolidayList,
} = workdaySlice.actions
export const workDaySliceReducer = workdaySlice.reducer
