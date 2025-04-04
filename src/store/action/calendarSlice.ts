import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface EachCalendarState {
	date: string
	status: string
}

const initialState: EachCalendarState[] = []

const calendarSlice = createSlice({
	name: 'calendar',
	initialState,
	reducers: {
		setCalendarUpdate: (state, action: PayloadAction<EachCalendarState>) => {
			const index = state.findIndex(item => item.date === action.payload.date)

			if (index !== -1) {
				state[index] = action.payload
			} else {
				state.push(action.payload)
			}
		},
		calendarReset: () => {
			return initialState
		},
	},
})

export const { setCalendarUpdate, calendarReset } = calendarSlice.actions
export const calendarSliceReducer = calendarSlice.reducer
