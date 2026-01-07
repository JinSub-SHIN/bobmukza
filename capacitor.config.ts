import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
	appId: 'workout.app',
	appName: 'Workout',
	webDir: 'dist',
	server: {
		androidScheme: 'https',
	},
	plugins: {
		SplashScreen: {
			launchShowDuration: 2000,
			launchAutoHide: true,
			backgroundColor: '#ffffff',
			androidSplashResourceName: 'splash',
			androidScaleType: 'CENTER_CROP',
			showSpinner: false,
		},
	},
}

export default config
