import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MainPage } from '../pages/MainPage'
import { RafflePage } from '../pages/RafflePage'
import { Test } from '../components/component/playground/Test'

export const Router = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<MainPage />} />
				<Route path="/test" element={<RafflePage />} />
				<Route path="/playground" element={<Test />} />
			</Routes>
		</BrowserRouter>
	)
}
