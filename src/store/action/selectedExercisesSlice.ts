import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type SelectedExercise = {
	title: string
	agonist: string
}

export type WorkoutFormData = {
	workoutDate: string | null // ISO string format
	workoutTime: string | null // ISO string format
	workoutEndTime: string | null // ISO string format
	bodyPart: string[]
	exercises: Array<{
		exercise: string
		sets: Array<{
			weight: number | null
			reps: number | null
		}>
	}>
}

interface SelectedExercisesState {
	exercises: SelectedExercise[]
	workoutFormData: WorkoutFormData | null
}

const initialState: SelectedExercisesState = {
	exercises: [],
	workoutFormData: null,
}

const selectedExercisesSlice = createSlice({
	name: 'selectedExercises',
	initialState,
	reducers: {
		setExercises: (state, action: PayloadAction<SelectedExercise[]>) => {
			state.exercises = action.payload
		},
		addExercise: (state, action: PayloadAction<SelectedExercise>) => {
			const exists = state.exercises.some(
				e =>
					e.title === action.payload.title &&
					e.agonist === action.payload.agonist,
			)
			if (!exists) {
				state.exercises.push(action.payload)
			}
		},
		removeExercise: (state, action: PayloadAction<SelectedExercise>) => {
			state.exercises = state.exercises.filter(
				e =>
					!(
						e.title === action.payload.title &&
						e.agonist === action.payload.agonist
					),
			)
		},
		toggleExercise: (state, action: PayloadAction<SelectedExercise>) => {
			const exists = state.exercises.some(
				e =>
					e.title === action.payload.title &&
					e.agonist === action.payload.agonist,
			)
			if (exists) {
				state.exercises = state.exercises.filter(
					e =>
						!(
							e.title === action.payload.title &&
							e.agonist === action.payload.agonist
						),
				)
			} else {
				state.exercises.push(action.payload)
			}
		},
		clearExercises: state => {
			state.exercises = []
		},
		setWorkoutFormData: (state, action: PayloadAction<WorkoutFormData>) => {
			state.workoutFormData = action.payload
		},
		clearWorkoutFormData: state => {
			state.workoutFormData = null
		},
	},
})

export const {
	setExercises,
	addExercise,
	removeExercise,
	toggleExercise,
	clearExercises,
	setWorkoutFormData,
	clearWorkoutFormData,
} = selectedExercisesSlice.actions
export const selectedExercisesReducer = selectedExercisesSlice.reducer
