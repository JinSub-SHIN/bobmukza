import { useEffect } from 'react'
import { Tabs, Button } from 'antd'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { styled } from 'styled-components'
import { TonsilLayout } from '../../common/TonsilLayout'
import { ChestList } from './workout/ChestList'
import { RatList } from './workout/RatList'
import { SholderList } from './workout/SholderList'
import { LegList } from './workout/LegList'
import { ArmList } from './workout/ArmList'
import { CardioList } from './workout/Cardio'
import { EtcList } from './workout/EtcList'
import { RootState } from '../../../store'
import {
	SelectedExercise,
	toggleExercise,
} from '../../../store/action/selectedExercisesSlice'

const Container = styled.div`
	position: relative;
	padding-bottom: 80px;
`

const NextButtonContainer = styled.div`
	position: fixed;
	bottom: 120px;
	left: 0;
	right: 0;
	z-index: 100;
	width: 100%;
	max-width: 1200px;
	margin: 0 auto;
	padding: 0 24px;
	box-sizing: border-box;
	display: flex;
	justify-content: center;
	pointer-events: none;

	@media screen and (max-width: 768px) {
		bottom: 110px;
		padding: 0 16px;
	}
`

const NextButton = styled(Button)`
	width: auto;
	max-width: 400px;
	height: 44px;
	font-size: 15px;
	font-weight: 600;
	border-radius: 10px;
	border: none !important;
	background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
	color: white !important;
	padding: 0 24px;
	box-shadow: 0 3px 10px rgba(16, 185, 129, 0.3);
	transition: all 0.3s ease;
	pointer-events: auto;

	&:hover {
		background: linear-gradient(135deg, #059669 0%, #047857 100%) !important;
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
	}

	&:focus {
		background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
		color: white !important;
	}

	&:disabled {
		background: #d1d5db !important;
		color: #9ca3af !important;
		cursor: not-allowed;
		transform: translateY(0) !important;
		box-shadow: none !important;
	}

	@media screen and (max-width: 768px) {
		height: 40px;
		font-size: 14px;
		padding: 0 20px;
		max-width: 350px;
	}
`

export const WorkOutList = () => {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const [searchParams] = useSearchParams()
	const selectedExercises = useSelector(
		(state: RootState) => state.selectedExercises.exercises,
	)

	// 쿼리 파라미터에서 selectMode 확인
	const isSelectMode = searchParams.get('selectMode') === 'true'

	const handleExerciseToggle = (exercise: SelectedExercise) => {
		dispatch(toggleExercise(exercise))
	}

	const handleNext = () => {
		if (selectedExercises.length > 0) {
			// querystring의 userId와 userName이 있으면 함께 전달
			const userIdFromQuery = searchParams.get('userId')
			const userNameFromQuery = searchParams.get('userName')
			if (userIdFromQuery) {
				const queryParams = new URLSearchParams()
				queryParams.set('userId', userIdFromQuery)
				if (userNameFromQuery) {
					queryParams.set('userName', userNameFromQuery)
				}
				navigate(`/workout/write?${queryParams.toString()}`)
			} else {
				navigate('/workout/write')
			}
		}
	}

	// selectMode가 아닐 때만 선택 초기화 (단, 페이지를 처음 로드할 때만)
	useEffect(() => {
		// selectMode가 false이고, 선택된 운동이 없을 때만 초기화
		// 이렇게 하면 "다른 운동 추가하기"로 돌아왔을 때 기존 선택이 유지됨
		if (!isSelectMode && selectedExercises.length === 0) {
			// 이미 비어있으므로 초기화할 필요 없음
		}
	}, []) // 빈 배열로 한 번만 실행

	const items = [
		{
			label: '가슴',
			key: 'chest',
			children: (
				<ChestList
					selectedExercises={selectedExercises}
					onExerciseToggle={handleExerciseToggle}
					agonist="가슴"
					selectMode={isSelectMode}
				/>
			),
		},
		{
			label: '등',
			key: 'back',
			children: (
				<RatList
					selectedExercises={selectedExercises}
					onExerciseToggle={handleExerciseToggle}
					agonist="등"
					selectMode={isSelectMode}
				/>
			),
		},
		{
			label: '어깨',
			key: 'shoulders',
			children: (
				<SholderList
					selectedExercises={selectedExercises}
					onExerciseToggle={handleExerciseToggle}
					agonist="어깨"
					selectMode={isSelectMode}
				/>
			),
		},
		{
			label: '하체',
			key: 'legs',
			children: (
				<LegList
					selectedExercises={selectedExercises}
					onExerciseToggle={handleExerciseToggle}
					agonist="하체"
					selectMode={isSelectMode}
				/>
			),
		},
		{
			label: '팔',
			key: 'arms',
			children: (
				<ArmList
					selectedExercises={selectedExercises}
					onExerciseToggle={handleExerciseToggle}
					agonist="팔"
					selectMode={isSelectMode}
				/>
			),
		},
		{
			label: '유산소',
			key: 'cardio',
			children: (
				<CardioList
					selectedExercises={selectedExercises}
					onExerciseToggle={handleExerciseToggle}
					agonist="유산소"
					selectMode={isSelectMode}
				/>
			),
		},
		{
			label: '기타',
			key: 'etc',
			children: (
				<EtcList
					selectedExercises={selectedExercises}
					onExerciseToggle={handleExerciseToggle}
					agonist="기타"
					selectMode={isSelectMode}
				/>
			),
		},
	]

	return (
		<TonsilLayout>
			<Container>
				<Tabs
					tabPosition={'left'}
					items={items.map((item, _) => {
						return {
							label: item.label,
							key: item.key,
							children: item.children,
						}
					})}
				/>
				{isSelectMode && (
					<NextButtonContainer>
						<NextButton
							type="primary"
							onClick={handleNext}
							disabled={selectedExercises.length === 0}
						>
							다음 ({selectedExercises.length})
						</NextButton>
					</NextButtonContainer>
				)}
			</Container>
		</TonsilLayout>
	)
}
