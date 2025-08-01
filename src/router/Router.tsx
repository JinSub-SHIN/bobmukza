import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MainPage } from '../pages/MainPage'
import { RafflePage } from '../pages/RafflePage'

export const Router = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<MainPage />} />
				<Route path="/test" element={<RafflePage />} />
			</Routes>
		</BrowserRouter>
	)
}
