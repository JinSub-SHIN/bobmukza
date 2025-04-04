import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { workDaySliceReducer } from './action/workdaySlice'
import { calendarSliceReducer } from './action/calendarSlice'

const persistConfig = {
	key: 'root',
	storage,
}

const reducers = combineReducers({
	workdayStatus: workDaySliceReducer,
	calendarStatus: calendarSliceReducer,
})

const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
	reducer: persistedReducer,
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: false, // redux-persist 관련 직렬화 체크 비활성화
		}),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
