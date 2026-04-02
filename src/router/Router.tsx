import {
	BrowserRouter,
	Route,
	Routes,
	Navigate,
	useNavigate,
} from 'react-router-dom'
import { useEffect } from 'react'
import { MainPage } from '../pages/MainPage'
import { RafflePage } from '../pages/RafflePage'
import { Test } from '../components/component/playground/Test'
import { CoinApiPage } from '../pages/CoinApiPage'
import { WorkOutListPage } from '../pages/WorkOutListPage'
import { WorkOutInsertPage } from '../pages/InsertWorkOutPage'
import { WorkOutWritePage } from '../pages/WorkOutWritePage'
import { LoginScreen } from '../components/component/tonsil/login/LoginScreen'
import { LoginStep } from '../components/component/tonsil/login/LoginStep'
import { UserList } from '../components/component/tonsil/trainerOnly/UserList'
import { WorkOutCalendar } from '../components/component/tonsil/calendar/WorkOutCalendar'
import { TonsilLayout } from '../components/common/TonsilLayout'

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
	const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'

	if (!isLoggedIn) {
		return <Navigate to="/" replace />
	}

	return children
}

const MainRoute = () => {
	const navigate = useNavigate()
	const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'

	useEffect(() => {
		if (isLoggedIn) {
			const userType = localStorage.getItem('userType')
			if (userType === 'trainer') {
				navigate('/member/management', { replace: true })
			} else {
				navigate('/workout/calendar', { replace: true })
			}
		}
	}, [isLoggedIn, navigate])

	if (!isLoggedIn) {
		return <LoginScreen />
	}

	// 리다이렉트 중일 때는 아무것도 렌더링하지 않음
	return null
}

export const Router = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/bobmukza" element={<MainPage />} />
				<Route path="/" element={<MainPage />} />
				<Route
					path="/workout/list"
					element={
						<ProtectedRoute>
							<WorkOutListPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/workout/calendar"
					element={
						<ProtectedRoute>
							<TonsilLayout>
								<WorkOutCalendar />
							</TonsilLayout>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/member/management"
					element={
						<ProtectedRoute>
							<TonsilLayout>
								<UserList />
							</TonsilLayout>
						</ProtectedRoute>
					}
				/>
				<Route path="/member/login" element={<LoginStep />} />
				<Route path="/trainer/login" element={<LoginStep />} />
				<Route path="/workout/insert" element={<WorkOutInsertPage />} />
				<Route path="/workout/write" element={<WorkOutWritePage />} />
				<Route path="/test" element={<RafflePage />} />
				<Route path="/coinApi" element={<CoinApiPage />} />
				<Route path="/playground" element={<Test />} />
			</Routes>
		</BrowserRouter>
	)
}
