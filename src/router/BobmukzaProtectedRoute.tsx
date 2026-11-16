import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { isBobmukzaLoggedIn } from '../auth/bobmukzaSession'

/** 비로그인 시 `/login`으로 보내고, 자식 라우트는 `<Outlet />`으로 렌더 */
export const BobmukzaAuthGate = () => {
	const location = useLocation()

	if (!isBobmukzaLoggedIn()) {
		return (
			<Navigate
				to="/login"
				replace
				state={{ from: `${location.pathname}${location.search}` }}
			/>
		)
	}

	return <Outlet />
}

export const BobmukzaProtectedRoute = ({
	children,
}: {
	children: React.ReactElement
}) => {
	const location = useLocation()

	if (!isBobmukzaLoggedIn()) {
		return (
			<Navigate
				to="/login"
				replace
				state={{ from: `${location.pathname}${location.search}` }}
			/>
		)
	}

	return children
}