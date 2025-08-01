import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store } from './store/index.ts'
import { persistStore } from 'redux-persist'
import { Router } from './router/Router.tsx'

const persistor = persistStore(store)

createRoot(document.getElementById('root')!).render(
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistor}>
			<Router />
		</PersistGate>
	</Provider>,
)
