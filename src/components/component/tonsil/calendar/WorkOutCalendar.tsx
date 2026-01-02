import {
	DatePicker,
	ConfigProvider,
	Select,
	Button,
	Tabs,
	Modal,
	Input,
} from 'antd'
import { styled } from 'styled-components'
import { useState, useMemo, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import type { Dayjs } from 'dayjs'
import locale from 'antd/locale/ko_KR'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import 'dayjs/locale/ko'
import {
	clearExercises,
	clearWorkoutFormData,
} from '../../../../store/action/selectedExercisesSlice'
import { FatigueLevel } from './FatigueLevel'
import { supabase } from '../../../database/supabase'
import { DeleteOutlined } from '@ant-design/icons'

// dayjs 한국어 locale 설정
dayjs.locale('ko')
dayjs.extend(weekOfYear)

const PageTitle = styled.h1`
	font-size: 28px;
	font-weight: 700;
	margin: 20px;
	color: #333;
	padding-bottom: 16px;
	border-bottom: 2px solid #e5e7eb;

	@media screen and (max-width: 768px) {
		font-size: 24px;
		margin: 16px;
		padding-bottom: 12px;
	}

	@media screen and (max-width: 480px) {
		font-size: 20px;
		margin: 12px;
		padding-bottom: 10px;
	}
`

const StyledTabs = styled(Tabs)`
	margin: 0 20px 24px 20px;

	.ant-tabs-tab {
		font-size: 16px;
		font-weight: 600;
		padding: 12px 24px;
		transition: all 0.3s ease;
	}

	.ant-tabs-tab-active {
		.ant-tabs-tab-btn {
			color: #10b981 !important;
		}
	}

	.ant-tabs-ink-bar {
		background: linear-gradient(135deg, #10b981 0%, #059669 100%);
		height: 3px;
	}

	.ant-tabs-tab:hover {
		color: #10b981;
	}

	@media screen and (max-width: 768px) {
		margin: 0 16px 20px 16px;

		.ant-tabs-tab {
			font-size: 14px;
			padding: 10px 16px;
		}
	}
`

const FormContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	padding: 20px;
	margin: 20px;
	background: #fff;
	border-radius: 8px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

	@media screen and (max-width: 768px) {
		padding: 16px;
		margin: 16px;
		gap: 12px;
	}

	@media screen and (max-width: 480px) {
		padding: 12px;
		margin: 12px;
		gap: 10px;
	}
`

const FormItem = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;

	@media screen and (max-width: 768px) {
		flex-direction: column;
		align-items: flex-start;
		gap: 8px;
	}

	@media screen and (max-width: 480px) {
		gap: 6px;
	}
`

const Label = styled.label`
	font-size: 10px;
	font-weight: 600;
	color: #333;
	min-width: 120px;
	flex-shrink: 0;

	@media screen and (max-width: 768px) {
		font-size: 14px;
		min-width: auto;
	}

	@media screen and (max-width: 480px) {
		font-size: 13px;
	}
`

const InputWrapper = styled.div`
	flex: 1;
	min-width: 0;
	width: 100%;

	@media screen and (max-width: 768px) {
		width: 100%;
	}

	.ant-picker,
	.ant-select {
		width: 100%;
	}
`

const ResetButton = styled(Button)`
	margin-top: 3px;
	width: 100%;

	@media screen and (max-width: 768px) {
		margin-top: 12px;
		width: 100%;
	}
`

const WriteButton = styled(Button)`
	margin-top: 16px;
	width: 100%;
	height: 48px;
	background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
	border: none !important;
	color: #fff !important;
	border-radius: 12px;
	font-size: 16px;
	font-weight: 700;
	box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
	transition: all 0.3s ease;

	&:hover,
	&:focus,
	&:active {
		background: linear-gradient(135deg, #059669 0%, #047857 100%) !important;
		box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4) !important;
		border: none !important;
		color: #fff !important;
		transform: translateY(-2px);
	}

	@media screen and (max-width: 768px) {
		margin-top: 12px;
		width: 100%;
		height: 44px;
		font-size: 15px;
	}
`

const CardsContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
	gap: 20px;
	margin-top: 24px;
	padding: 24px;
	background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
	border-radius: 12px;
	box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.04);

	@media screen and (max-width: 768px) {
		grid-template-columns: 1fr;
		gap: 16px;
		padding: 20px;
		margin-top: 20px;
	}

	@media screen and (max-width: 480px) {
		padding: 16px;
		gap: 14px;
		margin-top: 16px;
	}
`

const WorkoutCard = styled.div`
	background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
	border-radius: 16px;
	padding: 24px;
	box-shadow:
		0 4px 16px rgba(0, 0, 0, 0.08),
		0 2px 4px rgba(0, 0, 0, 0.04);
	border: 1px solid rgba(16, 185, 129, 0.1);
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	position: relative;
	overflow: hidden;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: linear-gradient(90deg, #10b981 0%, #059669 100%);
	}

	&:hover {
		transform: translateY(-4px);
		box-shadow:
			0 8px 24px rgba(16, 185, 129, 0.15),
			0 4px 8px rgba(0, 0, 0, 0.08);
		border-color: rgba(16, 185, 129, 0.3);
	}

	@media screen and (max-width: 768px) {
		padding: 20px;
		border-radius: 14px;
	}

	@media screen and (max-width: 480px) {
		padding: 16px;
		border-radius: 12px;
	}
`

const CardHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
	padding-bottom: 16px;
	border-bottom: 2px solid rgba(16, 185, 129, 0.2);
	width: 100%;

	@media screen and (max-width: 768px) {
		margin-bottom: 16px;
		padding-bottom: 12px;
	}

	@media screen and (max-width: 480px) {
		margin-bottom: 14px;
		padding-bottom: 10px;
	}
`

const HeaderLeft = styled.div`
	flex: 0 0 auto;
`

const DateText = styled.div`
	font-size: 18px;
	color: #1a1a1a;
	font-weight: 800;
	letter-spacing: -0.5px;
	display: flex;
	align-items: center;
	gap: 8px;

	&::before {
		content: '💪';
		font-size: 18px;
	}

	@media screen and (max-width: 768px) {
		font-size: 18px;
	}

	@media screen and (max-width: 480px) {
		font-size: 16px;
	}
`

const TimeText = styled.div`
	font-size: 16px;
	color: #666;
	font-weight: 600;
	letter-spacing: -0.5px;
	margin-top: 8px;
	display: flex;
	align-items: center;
	gap: 6px;
`

const BodyPartTag = styled.span`
	display: inline-block;
	padding: 8px 18px;
	background: linear-gradient(135deg, #10b981 0%, #059669 100%);
	color: #fff;
	border-radius: 24px;
	font-size: 15px;
	font-weight: 700;
	box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
	transition: all 0.2s ease;
	letter-spacing: 0.3px;

	&:hover {
		transform: scale(1.05);
		box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
	}

	@media screen and (max-width: 768px) {
		font-size: 14px;
		padding: 6px 16px;
	}

	@media screen and (max-width: 480px) {
		font-size: 13px;
		padding: 5px 14px;
	}
`

const ExerciseName = styled.h3`
	font-size: 20px;
	font-weight: 800;
	color: #1a1a1a;
	margin: 0 0 18px 0;
	padding: 12px 16px;
	background: linear-gradient(
		135deg,
		rgba(16, 185, 129, 0.05) 0%,
		rgba(5, 150, 105, 0.05) 100%
	);
	border-radius: 10px;
	border-left: 4px solid #10b981;
	letter-spacing: -0.3px;

	@media screen and (max-width: 768px) {
		font-size: 18px;
		margin-bottom: 14px;
		padding: 10px 14px;
	}

	@media screen and (max-width: 480px) {
		font-size: 16px;
		margin-bottom: 12px;
		padding: 8px 12px;
	}
`

const SetsInfo = styled.div`
	font-size: 15px;
	color: #555;
	margin-bottom: 14px;
	font-weight: 600;
	padding: 8px 12px;
	background: #f8f9fa;
	border-radius: 8px;
	display: inline-block;

	@media screen and (max-width: 480px) {
		font-size: 14px;
		margin-bottom: 12px;
		padding: 6px 10px;
	}
`

const VolumeInfo = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	padding: 16px;
	background: linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%);
	border-radius: 12px;
	margin-top: 16px;
	border: 1px solid rgba(16, 185, 129, 0.1);
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

	@media screen and (max-width: 480px) {
		padding: 12px;
		margin-top: 12px;
	}
`

const VolumeLabel = styled.span`
	font-size: 14px;
	color: #666;
	font-weight: 600;
	letter-spacing: 0.3px;
`

const VolumeValue = styled.span`
	font-size: 18px;
	font-weight: 800;
	color: #10b981;
	letter-spacing: -0.5px;

	@media screen and (max-width: 480px) {
		font-size: 16px;
	}
`

const SetDetail = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 15px;
	color: #333;
	margin-bottom: 8px;
	padding: 8px 12px;
	background: #fafbfc;
	border-radius: 8px;
	border-left: 3px solid #10b981;
	transition: all 0.2s ease;

	&:hover {
		background: #ecfdf5;
		transform: translateX(4px);
	}

	@media screen and (max-width: 480px) {
		font-size: 14px;
		margin-bottom: 6px;
		padding: 6px 10px;
	}
`

const SetNumber = styled.span`
	font-weight: 700;
	color: #10b981;
	min-width: 35px;
	font-size: 16px;
`

const SetFormula = styled.span`
	color: #666;
`

const ReviewSection = styled.div`
	margin-top: 24px;
	padding-top: 20px;
	border-top: 2px solid rgba(16, 185, 129, 0.1);
	display: flex;
	flex-direction: column;
	gap: 16px;
`

const UserReviewBubble = styled.div`
	position: relative;
	background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
	border-radius: 16px;
	padding: 16px;
	box-shadow: 0 2px 8px rgba(14, 165, 233, 0.15);

	&::after {
		content: '';
		position: absolute;
		bottom: -8px;
		left: 24px;
		width: 0;
		height: 0;
		border-left: 8px solid transparent;
		border-right: 8px solid transparent;
		border-top: 8px solid #bae6fd;
	}
`

const ReviewLabel = styled.div`
	font-size: 12px;
	font-weight: 700;
	color: #0369a1;
	margin-bottom: 8px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
`

const ReviewText = styled.div`
	font-size: 14px;
	color: #0c4a6e;
	line-height: 1.6;
	word-break: break-word;
`

const TrainerReviewContainer = styled.div`
	background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
	border-radius: 12px;
	padding: 16px;
	box-shadow: 0 2px 8px rgba(217, 119, 6, 0.15);
	border: 1px solid rgba(217, 119, 6, 0.2);
`

const TrainerReviewLabel = styled.div`
	font-size: 12px;
	font-weight: 700;
	color: #92400e;
	margin-bottom: 8px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
`

const TrainerReviewText = styled.div<{ isEmpty?: boolean }>`
	font-size: 14px;
	color: #78350f;
	line-height: 1.6;
	word-break: break-word;
	font-style: ${props => (props.isEmpty ? 'italic' : 'normal')};
	opacity: ${props => (props.isEmpty ? 0.7 : 1)};
	margin-bottom: ${props => (props.isEmpty ? '12px' : '0')};
`

const ReviewRegisterButton = styled(Button)`
	margin-top: 12px;
	width: 100%;
	height: 36px;
	background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
	border: none !important;
	color: #fff !important;
	border-radius: 8px;
	font-size: 14px;
	font-weight: 600;
	transition: all 0.3s ease;

	&:hover,
	&:focus,
	&:active {
		background: linear-gradient(135deg, #d97706 0%, #b45309 100%) !important;
		box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4) !important;
		border: none !important;
		color: #fff !important;
		transform: translateY(-2px);
	}
`

const DeleteButton = styled(Button)`
	margin-top: 16px;
	width: 100%;
	height: 40px;
	background: #ef4444 !important;
	border: none !important;
	color: #fff !important;
	border-radius: 8px;
	font-size: 14px;
	font-weight: 600;
	transition: all 0.3s ease;

	&:hover,
	&:focus,
	&:active {
		background: #dc2626 !important;
		border: none !important;
		color: #fff !important;
		transform: translateY(-1px);
		box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
	}

	@media screen and (max-width: 480px) {
		height: 36px;
		font-size: 13px;
		margin-top: 12px;
	}
`

export const WorkOutCalendar = () => {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const [searchParams] = useSearchParams()
	const userType = localStorage.getItem('userType')
	const isTrainer = userType === 'trainer'
	// 트레이너가 회원을 선택한 경우 해당 회원의 일지만 보여주기 위해 사용
	const selectedUserId = searchParams.get('userId')
	const selectedUserName = searchParams.get('userName')
	const currentUserId = localStorage.getItem('userId')
	const targetUserId = selectedUserId || currentUserId || ''

	// 필터 상태 관리
	const [selectedWeek, setSelectedWeek] = useState<Dayjs | null>(null)
	const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null)
	const [activeTab, setActiveTab] = useState<string>('workout')
	const [workoutData, setWorkoutData] = useState<
		Array<{
			sessionId: string
			userId: string
			date: string
			time: string | null
			endTime: string | null
			bodyPart: string
			exerciseName: string
			sets: number
			setsDetail: Array<{ weight: number; reps: number }>
			userReview?: string | null
			trainerReview?: string | null
		}>
	>([])
	const [loading, setLoading] = useState(false)
	const [reviewModalVisible, setReviewModalVisible] = useState(false)
	const [reviewText, setReviewText] = useState('')
	const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
		null,
	)

	// 부위 선택 핸들러
	const handleChange = (value: string) => {
		setSelectedBodyPart(value)
	}

	// 월 기준 주차 계산 함수
	const getWeekOfMonth = (date: Dayjs) => {
		const monthStart = date.startOf('month')
		const weekStart = date.startOf('week')
		const monthWeekStart = monthStart.startOf('week')

		// 주 시작일(월요일) 기준으로 차이 계산
		const diffInDays = weekStart.diff(monthWeekStart, 'day')
		const weekOfMonth = Math.floor(diffInDays / 7) + 1

		return weekOfMonth
	}

	// 주간 선택 핸들러
	const onChange = (date: Dayjs | (Dayjs | null)[] | null) => {
		if (date && !Array.isArray(date)) {
			setSelectedWeek(date)
		} else {
			setSelectedWeek(null)
		}
	}

	// 초기화 핸들러
	const handleReset = () => {
		setSelectedWeek(null)
		setSelectedBodyPart(null)
	}

	const formatValue = (date: Dayjs | null) => {
		if (!date) return ''
		const year = date.year()
		const month = date.month() + 1
		const week = getWeekOfMonth(date)
		return `${year}-${month}월-${week}주차`
	}

	// 데이터베이스에서 운동 데이터 불러오기 함수
	const fetchWorkoutData = useCallback(async () => {
		if (!targetUserId) {
			setWorkoutData([])
			return
		}

		setLoading(true)
		try {
			// 1. workout_sessions 가져오기 (workout_date와 workout_end_date를 datetime으로 조회)
			const { data: sessions, error: sessionsError } = await supabase
				.from('workout_sessions')
				.select(
					'id, workout_date, workout_end_date, body_part, user_id, user_review, trainer_review',
				)
				.eq('user_id', targetUserId)
				.order('workout_date', { ascending: false })

			if (sessionsError) {
				console.error('세션 조회 실패:', sessionsError)
				setLoading(false)
				return
			}

			if (!sessions || sessions.length === 0) {
				setWorkoutData([])
				setLoading(false)
				return
			}

			// 2. 각 세션에 대한 exercises 가져오기
			const sessionIds = sessions.map(s => s.id)
			const { data: exercises, error: exercisesError } = await supabase
				.from('exercises')
				.select('id, session_id, exercise_name, total_sets')
				.in('session_id', sessionIds)

			if (exercisesError) {
				console.error('운동 조회 실패:', exercisesError)
				setLoading(false)
				return
			}

			if (!exercises || exercises.length === 0) {
				setWorkoutData([])
				setLoading(false)
				return
			}

			// 3. 각 exercise에 대한 exercise_sets 가져오기
			const exerciseIds = exercises.map(e => e.id)
			const { data: sets, error: setsError } = await supabase
				.from('exercise_sets')
				.select('exercise_id, set_order, weight, reps')
				.in('exercise_id', exerciseIds)
				.order('set_order', { ascending: true })

			if (setsError) {
				console.error('세트 조회 실패:', setsError)
				setLoading(false)
				return
			}

			// 4. 데이터 변환
			const transformedData: typeof workoutData = []

			for (const session of sessions) {
				const sessionExercises = exercises.filter(
					e => e.session_id === session.id,
				)

				for (const exercise of sessionExercises) {
					const exerciseSets = sets
						.filter(s => s.exercise_id === exercise.id)
						.sort((a, b) => a.set_order - b.set_order)

					if (exerciseSets.length > 0) {
						// workout_date에서 날짜와 시간 추출
						const workoutDateTime = session.workout_date
							? dayjs(session.workout_date)
							: null
						const workoutEndDateTime = session.workout_end_date
							? dayjs(session.workout_end_date)
							: null

						const date = workoutDateTime
							? workoutDateTime.format('YYYY-MM-DD')
							: session.workout_date?.split(' ')[0] || ''
						const time = workoutDateTime
							? workoutDateTime.format('HH:mm')
							: session.workout_date?.split(' ')[1]?.substring(0, 5) || null
						const endTime = workoutEndDateTime
							? workoutEndDateTime.format('HH:mm')
							: session.workout_end_date?.split(' ')[1]?.substring(0, 5) || null

						transformedData.push({
							sessionId: session.id,
							userId: session.user_id,
							date: date,
							time: time,
							endTime: endTime,
							bodyPart: session.body_part,
							exerciseName: exercise.exercise_name,
							sets: exercise.total_sets,
							setsDetail: exerciseSets.map(set => ({
								weight: Number(set.weight),
								reps: set.reps,
							})),
							userReview: session.user_review || null,
							trainerReview: session.trainer_review || null,
						})
					}
				}
			}

			setWorkoutData(transformedData)
		} catch (error) {
			console.error('데이터 로딩 중 오류:', error)
		} finally {
			setLoading(false)
		}
	}, [targetUserId])

	// 데이터베이스에서 운동 데이터 불러오기
	useEffect(() => {
		fetchWorkoutData()
	}, [fetchWorkoutData])

	// 볼륨 계산 함수
	const calculateVolume = (setsDetail: { weight: number; reps: number }[]) => {
		return setsDetail.reduce((total, set) => total + set.weight * set.reps, 0)
	}

	// 부위 매핑 (영어 -> 한국어)
	const bodyPartMap: Record<string, string> = {
		chest: '가슴',
		back: '등',
		shoulder: '어깨',
		arm: '팔',
		leg: '하체',
		cardio: '유산소',
	}

	// 필터링된 데이터 계산
	const filteredData = useMemo(() => {
		let filtered = [...workoutData]

		// 주간 필터링
		if (selectedWeek) {
			const weekStart = selectedWeek.startOf('week')
			const weekEnd = selectedWeek.endOf('week')
			filtered = filtered.filter(workout => {
				const workoutDate = dayjs(workout.date)
				return (
					(workoutDate.isAfter(weekStart) || workoutDate.isSame(weekStart)) &&
					(workoutDate.isBefore(weekEnd) || workoutDate.isSame(weekEnd))
				)
			})
		}

		// 부위 필터링
		if (selectedBodyPart) {
			const bodyPartKorean = bodyPartMap[selectedBodyPart]
			filtered = filtered.filter(workout => workout.bodyPart === bodyPartKorean)
		}

		return filtered
	}, [selectedWeek, selectedBodyPart, workoutData])

	// 세션별로 그룹화 (날짜와 시간대별로 묶기)
	const groupedBySession = useMemo(() => {
		const sessionMap = new Map<string, typeof workoutData>()

		for (const workout of filteredData) {
			// 날짜와 시간을 조합한 키 생성 (시간이 없으면 날짜만 사용)
			const timeKey = workout.time || '00:00'
			const sessionKey = `${workout.date}_${timeKey}`
			if (!sessionMap.has(sessionKey)) {
				sessionMap.set(sessionKey, [])
			}
			sessionMap.get(sessionKey)!.push(workout)
		}

		// Map을 객체로 변환
		const result: Record<string, typeof workoutData> = {}
		for (const [sessionKey, workouts] of sessionMap.entries()) {
			result[sessionKey] = workouts
		}

		return result
	}, [filteredData])

	// 날짜별 총 볼륨 계산
	const calculateTotalVolumeForDate = (workouts: typeof workoutData) => {
		return workouts.reduce((total, workout) => {
			return total + calculateVolume(workout.setsDetail)
		}, 0)
	}

	// 운동 일지 삭제 함수 (여러 세션 ID를 받을 수 있음)
	const handleDeleteWorkout = async (sessionIds: string[]) => {
		if (!window.confirm('정말 이 운동 일지를 삭제하시겠습니까?')) {
			return
		}

		try {
			// 여러 세션을 한 번에 삭제
			const { error } = await supabase
				.from('workout_sessions')
				.delete()
				.in('id', sessionIds)

			if (error) {
				console.error('삭제 실패:', error)
				alert('삭제에 실패했습니다.')
				return
			}

			// 삭제 성공 시 데이터 다시 불러오기
			await fetchWorkoutData()
			alert('운동 일지가 삭제되었습니다.')
		} catch (error) {
			console.error('삭제 중 오류:', error)
			alert('삭제 중 오류가 발생했습니다.')
		}
	}

	// 리뷰 등록 모달 열기
	const handleOpenReviewModal = (sessionId: string) => {
		setSelectedSessionId(sessionId)
		setReviewText('')
		setReviewModalVisible(true)
	}

	// 리뷰 등록 모달 닫기
	const handleCloseReviewModal = () => {
		setReviewModalVisible(false)
		setReviewText('')
		setSelectedSessionId(null)
	}

	// 리뷰 저장
	const handleSaveReview = async () => {
		if (!selectedSessionId) return

		if (!reviewText.trim()) {
			alert('리뷰를 입력해주세요.')
			return
		}

		try {
			const { error } = await supabase
				.from('workout_sessions')
				.update({ trainer_review: reviewText.trim() })
				.eq('id', selectedSessionId)

			if (error) {
				console.error('리뷰 저장 실패:', error)
				alert('리뷰 저장에 실패했습니다.')
			} else {
				alert('리뷰가 등록되었습니다.')
				handleCloseReviewModal()
				await fetchWorkoutData()
			}
		} catch (error) {
			console.error('리뷰 저장 중 오류:', error)
			alert('리뷰 저장 중 오류가 발생했습니다.')
		}
	}

	const workoutLogContent = (
		<>
			<FormContainer>
				<FormItem>
					<Label>주간검색</Label>
					<InputWrapper>
						<ConfigProvider locale={locale}>
							<DatePicker
								value={selectedWeek}
								onChange={onChange}
								picker="week"
								placeholder="주간을 선택하세요"
								format={value => formatValue(value)}
							/>
						</ConfigProvider>
					</InputWrapper>
				</FormItem>
				<FormItem>
					<Label>부위별검색</Label>
					<InputWrapper>
						<Select
							placeholder="부위를 선택하세요"
							value={selectedBodyPart}
							onChange={handleChange}
							options={[
								{ value: 'chest', label: '가슴' },
								{ value: 'back', label: '등' },
								{ value: 'shoulder', label: '어깨' },
								{ value: 'arm', label: '팔' },
								{ value: 'leg', label: '하체' },
								{ value: 'cardio', label: '유산소' },
							]}
						/>
					</InputWrapper>
				</FormItem>
				<FormItem>
					<Label></Label>
					<InputWrapper>
						<ResetButton type="default" onClick={handleReset}>
							초기화
						</ResetButton>
					</InputWrapper>
				</FormItem>
			</FormContainer>

			<div
				style={{
					padding: '0 20px',
					marginTop: '24px',
					marginBottom: '4px',
				}}
			>
				<WriteButton
					type="primary"
					onClick={() => {
						// Redux 데이터 초기화
						dispatch(clearExercises())
						dispatch(clearWorkoutFormData())
						// 트레이너가 회원을 선택한 경우 userId와 userName을 querystring에 포함
						const queryParams = new URLSearchParams()
						queryParams.set('selectMode', 'true')
						if (isTrainer && selectedUserId) {
							queryParams.set('userId', selectedUserId)
							if (selectedUserName) {
								queryParams.set('userName', selectedUserName)
							}
						}
						navigate(`/workout/list?${queryParams.toString()}`)
					}}
				>
					✏️ 일지쓰기
				</WriteButton>
			</div>

			<CardsContainer>
				{loading ? (
					<div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
						로딩 중...
					</div>
				) : Object.keys(groupedBySession).length === 0 ? (
					<div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
						저장된 운동 일지가 없습니다.
					</div>
				) : (
					Object.entries(groupedBySession)
						.sort(([sessionKeyA], [sessionKeyB]) => {
							// 세션 키에서 날짜 추출하여 정렬 (내림차순 - 최신순)
							const dateA = sessionKeyA.split('_')[0]
							const dateB = sessionKeyB.split('_')[0]
							return dayjs(dateB).valueOf() - dayjs(dateA).valueOf()
						})
						.map(([sessionKey, workouts]) => {
							// 세션 키에서 날짜와 시간 추출 (형식: YYYY-MM-DD_HH:mm)
							const [date, time] = sessionKey.split('_')
							// 삭제를 위해 같은 그룹의 모든 세션 ID 수집
							const workoutsArray = workouts as typeof workoutData
							const sessionIds = [
								...new Set(workoutsArray.map(w => w.sessionId)),
							]
							const totalVolume = calculateTotalVolumeForDate(
								workouts as typeof workoutData,
							)
							const uniqueBodyParts = [
								...new Set(
									(workouts as typeof workoutData).map(w => w.bodyPart),
								),
							]

							// 로그인된 사용자와 일지의 user_id 비교
							const isOwner =
								workoutsArray.length > 0 &&
								workoutsArray[0].userId === currentUserId

							// 운동 시간 계산 (분 단위)
							let totalMinutes = 0
							if (
								time &&
								time !== '00:00' &&
								workoutsArray[0]?.endTime &&
								workoutsArray[0].endTime !== '00:00'
							) {
								const startTime = dayjs(`${date} ${time}`, 'YYYY-MM-DD HH:mm')
								const endTime = dayjs(
									`${date} ${workoutsArray[0].endTime}`,
									'YYYY-MM-DD HH:mm',
								)
								totalMinutes = endTime.diff(startTime, 'minute')
							}

							return (
								<WorkoutCard key={sessionKey}>
									<CardHeader>
										<HeaderLeft style={{ width: '100%' }}>
											<div
												style={{
													display: 'flex',
													justifyContent: 'space-between',
													alignItems: 'center',
													width: '100%',
												}}
											>
												<DateText>
													{dayjs(date).format('YYYY-MM-DD')} (
													{dayjs(date).format('ddd')})
												</DateText>
												<div style={{ display: 'flex', gap: '6px' }}>
													{uniqueBodyParts.map(bodyPart => (
														<BodyPartTag key={bodyPart}>{bodyPart}</BodyPartTag>
													))}
												</div>
											</div>
											<TimeText>
												<span>🕐</span>
												{time && time !== '00:00' ? (
													<>
														{time}
														{workoutsArray[0]?.endTime &&
															workoutsArray[0].endTime !== '00:00' && (
																<>
																	{' - '}
																	{workoutsArray[0].endTime}
																	{totalMinutes > 0 &&
																		` (총 ${totalMinutes}분)`}
																</>
															)}
													</>
												) : (
													'시간 미기입'
												)}
											</TimeText>
										</HeaderLeft>
									</CardHeader>

									{(workouts as typeof workoutData).map(
										(workout, workoutIndex) => {
											const exerciseVolume = calculateVolume(workout.setsDetail)
											const workoutsArray = workouts as typeof workoutData
											return (
												<div
													key={workoutIndex}
													style={{
														marginBottom:
															workoutIndex < workoutsArray.length - 1
																? '28px'
																: '0',
														paddingBottom:
															workoutIndex < workoutsArray.length - 1
																? '28px'
																: '0',
														borderBottom:
															workoutIndex < workoutsArray.length - 1
																? '2px dashed rgba(16, 185, 129, 0.2)'
																: 'none',
													}}
												>
													<ExerciseName>{workout.exerciseName}</ExerciseName>
													<SetsInfo>세트수: {workout.sets}세트</SetsInfo>
													<div>
														{workout.setsDetail.map((set, setIndex) => (
															<SetDetail key={setIndex}>
																<SetNumber>{setIndex + 1}세트:</SetNumber>
																<SetFormula>
																	{set.weight}kg × {set.reps}회
																</SetFormula>
															</SetDetail>
														))}
													</div>
													<VolumeInfo style={{ marginTop: '12px' }}>
														<VolumeLabel>볼륨:</VolumeLabel>
														<VolumeValue>
															{exerciseVolume.toLocaleString()}kg
														</VolumeValue>
													</VolumeInfo>
												</div>
											)
										},
									)}

									<VolumeInfo
										style={{
											marginTop: '20px',
											background:
												'linear-gradient(135deg, #10b981 0%, #059669 100%)',
											color: '#fff',
											border: 'none',
											boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
										}}
									>
										<VolumeLabel style={{ color: '#fff', fontSize: '15px' }}>
											총 볼륨:
										</VolumeLabel>
										<VolumeValue style={{ color: '#fff', fontSize: '20px' }}>
											{totalVolume.toLocaleString()}kg
										</VolumeValue>
									</VolumeInfo>

									{/* 리뷰 섹션 */}
									{workoutsArray.length > 0 && (
										<ReviewSection>
											{workoutsArray[0].userReview && (
												<UserReviewBubble>
													<ReviewLabel>내 리뷰</ReviewLabel>
													<ReviewText>{workoutsArray[0].userReview}</ReviewText>
												</UserReviewBubble>
											)}
											<TrainerReviewContainer>
												<TrainerReviewLabel>트레이너 리뷰</TrainerReviewLabel>
												{workoutsArray[0].trainerReview ? (
													<TrainerReviewText isEmpty={false}>
														{workoutsArray[0].trainerReview}
													</TrainerReviewText>
												) : (
													<>
														<TrainerReviewText isEmpty={true}>
															등록되지 않았습니다.
														</TrainerReviewText>
														{isTrainer && (
															<ReviewRegisterButton
																type="primary"
																onClick={() =>
																	handleOpenReviewModal(
																		workoutsArray[0].sessionId,
																	)
																}
															>
																리뷰 등록하기
															</ReviewRegisterButton>
														)}
													</>
												)}
											</TrainerReviewContainer>
										</ReviewSection>
									)}

									{isOwner && (
										<DeleteButton
											type="primary"
											danger
											onClick={() => handleDeleteWorkout(sessionIds)}
											icon={<DeleteOutlined />}
										>
											일지 삭제
										</DeleteButton>
									)}
								</WorkoutCard>
							)
						})
				)}
			</CardsContainer>
		</>
	)

	// 트레이너가 회원을 선택한 경우 탭 표시
	if (isTrainer && selectedUserName) {
		const tabItems = [
			{
				key: 'workout',
				label: '운동일지',
				children: workoutLogContent,
			},
			{
				key: 'fatigue',
				label: '신체피로도',
				children: <FatigueLevel />,
			},
		]

		return (
			<>
				<PageTitle>{decodeURIComponent(selectedUserName)} 회원님💪</PageTitle>
				<StyledTabs
					activeKey={activeTab}
					onChange={setActiveTab}
					items={tabItems}
				/>
				<Modal
					title="트레이너 리뷰 등록"
					open={reviewModalVisible}
					onOk={handleSaveReview}
					onCancel={handleCloseReviewModal}
					okText="등록"
					cancelText="취소"
					width={600}
				>
					<div style={{ marginBottom: '16px' }}>
						<label
							style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}
						>
							리뷰 내용
						</label>
						<Input.TextArea
							rows={6}
							placeholder="회원의 운동에 대한 리뷰를 작성해주세요"
							value={reviewText}
							onChange={e => setReviewText(e.target.value)}
							maxLength={500}
							showCount
						/>
					</div>
				</Modal>
			</>
		)
	}

	// 일반 회원 또는 트레이너가 회원을 선택하지 않은 경우 기존 레이아웃
	return (
		<ConfigProvider locale={locale}>
			{workoutLogContent}
			<Modal
				title="트레이너 리뷰 등록"
				open={reviewModalVisible}
				onOk={handleSaveReview}
				onCancel={handleCloseReviewModal}
				okText="등록"
				cancelText="취소"
				width={600}
			>
				<div style={{ marginBottom: '16px' }}>
					<label
						style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}
					>
						리뷰 내용
					</label>
					<Input.TextArea
						rows={6}
						placeholder="회원의 운동에 대한 리뷰를 작성해주세요"
						value={reviewText}
						onChange={e => setReviewText(e.target.value)}
						maxLength={500}
						showCount
					/>
				</div>
			</Modal>
		</ConfigProvider>
	)
}
