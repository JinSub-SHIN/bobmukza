import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { MainPage } from '../pages/MainPage'
import { BobmukzaLoginPage } from '../pages/BobmukzaLoginPage'
import { BobmukzaSignupPage } from '../pages/BobmukzaSignupPage'
import { BobmukzaAuthGate } from './BobmukzaProtectedRoute'
import { isBobmukzaLoggedIn } from '../auth/bobmukzaSession'
import { RafflePage } from '../pages/RafflePage'
import { Test } from '../components/component/playground/Test'
import { CoinApiPage } from '../pages/CoinApiPage'
import { WorkOutListPage } from '../pages/WorkOutListPage'
import { WorkOutInsertPage } from '../pages/InsertWorkOutPage'
import { WorkOutWritePage } from '../pages/WorkOutWritePage'

import { LoginStep } from '../components/component/tonsil/login/LoginStep'
import { UserList } from '../components/component/tonsil/trainerOnly/UserList'
import { WorkOutCalendar } from '../components/component/tonsil/calendar/WorkOutCalendar'
import { TonsilLayout } from '../components/common/TonsilLayout'

const TonsilProtectedRoute = ({ children }: { children: React.ReactElement }) => {
	const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'

	if (!isLoggedIn) {
		return <Navigate to="/member/login" replace />
	}

	return children
}

const GuestOnlyBobmukza = ({ children }: { children: React.ReactElement }) => {
	if (isBobmukzaLoggedIn()) {
		return <Navigate to="/" replace />
	}
	return children
}

export const Router = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/login"
					element={
						<GuestOnlyBobmukza>
							<BobmukzaLoginPage />
						</GuestOnlyBobmukza>
					}
				/>
				<Route
					path="/signup"
					element={
						<GuestOnlyBobmukza>
							<BobmukzaSignupPage />
						</GuestOnlyBobmukza>
					}
				/>

				<Route element={<BobmukzaAuthGate />}>
					<Route path="/" element={<MainPage />} />
					<Route path="/bobmukza" element={<MainPage />} />
					<Route
						path="/workout/list"
						element={
							<TonsilProtectedRoute>
								<WorkOutListPage />
							</TonsilProtectedRoute>
						}
					/>
					<Route
						path="/workout/calendar"
						element={
							<TonsilProtectedRoute>
								<TonsilLayout>
									<WorkOutCalendar />
								</TonsilLayout>
							</TonsilProtectedRoute>
						}
					/>
					<Route
						path="/member/management"
						element={
							<TonsilProtectedRoute>
								<TonsilLayout>
									<UserList />
								</TonsilLayout>
							</TonsilProtectedRoute>
						}
					/>
					<Route path="/member/login" element={<LoginStep />} />
					<Route path="/trainer/login" element={<LoginStep />} />
					<Route path="/workout/insert" element={<WorkOutInsertPage />} />
					<Route path="/workout/write" element={<WorkOutWritePage />} />
					<Route path="/test" element={<RafflePage />} />
					<Route path="/coinApi" element={<CoinApiPage />} />
					<Route path="/playground" element={<Test />} />
					<Route path="*" element={<Navigate to="/" replace />} />
				</Route>
			</Routes>
		</BrowserRouter>
	)
}