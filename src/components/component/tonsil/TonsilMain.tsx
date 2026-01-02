import { TonsilLayout } from '../../common/TonsilLayout'
import { WorkOutCalendar } from './calendar/WorkOutCalendar'
import { UserList } from './trainerOnly/UserList'

export const TonsilMain = () => {
	const userType = localStorage.getItem('userType')

	return (
		<TonsilLayout>
			{userType === 'trainer' ? <UserList /> : <WorkOutCalendar />}
		</TonsilLayout>
	)
}
