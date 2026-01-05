import { Form, Select, InputNumber, Button, DatePicker, Input } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { TonsilLayout } from '../../../common/TonsilLayout'
import { supabase } from '../../../database/supabase'
import { styled } from 'styled-components'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import type { FormProps } from 'antd'
import { RootState } from '../../../../store'
import {
	clearExercises,
	removeExercise as removeExerciseFromStore,
	SelectedExercise,
	setWorkoutFormData,
	clearWorkoutFormData,
} from '../../../../store/action/selectedExercisesSlice'

const FormContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 20px;
	padding: 24px;
	background: #fff;
	border-radius: 8px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	margin: 20px;

	@media screen and (max-width: 768px) {
		padding: 16px;
		margin: 16px;
	}
`

const FormItem = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin-bottom: 20px;
`

const Label = styled.label`
	font-size: 14px;
	font-weight: 600;
	color: #333;
`

const SetsContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
	margin-top: 8px;
	margin-bottom: 12px;
`

const SetItem = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 16px;
	background: #f8f9fa;
	border-radius: 8px;
	border: 1px solid #e9ecef;

	@media screen and (max-width: 768px) {
		flex-direction: column;
		align-items: stretch;
		gap: 8px;
	}
`

const SetLabel = styled.span`
	font-weight: 600;
	color: #10b981;
	min-width: 60px;
	font-size: 14px;
`

const InputGroup = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	flex: 1;

	@media screen and (max-width: 768px) {
		width: 100%;
	}
`

const AddButton = styled(Button)`
	width: 100%;
	height: 40px;
	margin-top: 0;
	background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
	border: none !important;
	color: #fff !important;
	font-weight: 600;

	&:hover,
	&:focus,
	&:active {
		background: linear-gradient(135deg, #059669 0%, #047857 100%) !important;
		border: none !important;
		color: #fff !important;
	}
`

const DeleteButton = styled(Button)`
	color: #ef4444;
	border-color: #ef4444;

	&:hover {
		color: #dc2626;
		border-color: #dc2626;
		background: #fee2e2;
	}
`

const SubmitButton = styled(Button)`
	width: 100%;
	height: 48px;
	background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
	border: none !important;
	font-size: 16px;
	font-weight: 700;
	box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
	color: #fff !important;

	&:hover,
	&:focus,
	&:active {
		background: linear-gradient(135deg, #059669 0%, #047857 100%) !important;
		box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4) !important;
		border: none !important;
		color: #fff !important;
	}
`

type SetData = {
	weight: number | null
	reps: number | null
}

type ExerciseData = {
	exercise: string
	sets: SetData[]
}

type FormData = {
	workoutDate: Dayjs
	workoutTimeHour: string
	workoutTimeMinute: string
	workoutEndTimeHour: string
	workoutEndTimeMinute: string
	bodyPart: string[]
	exercises: ExerciseData[]
	review?: string
}

export const WorkOutWrite = () => {
	const [form] = Form.useForm()
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const [searchParams] = useSearchParams()
	const selectedExercises = useSelector(
		(state: RootState) => state.selectedExercises.exercises,
	)
	const workoutFormData = useSelector(
		(state: RootState) => state.selectedExercises.workoutFormData,
	)
	const [selectedBodyParts, setSelectedBodyParts] = useState<string[]>([])
	const [exerciseList, setExerciseList] = useState<
		Array<{ title: string; agonist?: string }>
	>([])
	const [loading, setLoading] = useState(false)
	const [saving, setSaving] = useState(false)
	const [exercises, setExercises] = useState<ExerciseData[]>([
		{
			exercise: '',
			sets: [
				{ weight: null, reps: null },
				{ weight: null, reps: null },
				{ weight: null, reps: null },
			],
		},
	])
	const [isInitialized, setIsInitialized] = useState(false)

	// Redux store에서 저장된 폼 데이터 복원
	useEffect(() => {
		if (workoutFormData && !isInitialized) {
			// 날짜와 시간 복원
			if (workoutFormData.workoutDate) {
				form.setFieldsValue({
					workoutDate: dayjs(workoutFormData.workoutDate),
				})
			}
			if (workoutFormData.workoutTime) {
				const time = dayjs(workoutFormData.workoutTime)
				form.setFieldsValue({
					workoutTimeHour: time.format('HH'),
					workoutTimeMinute: time.format('mm'),
				})
			}
			if (workoutFormData.workoutEndTime) {
				const endTime = dayjs(workoutFormData.workoutEndTime)
				form.setFieldsValue({
					workoutEndTimeHour: endTime.format('HH'),
					workoutEndTimeMinute: endTime.format('mm'),
				})
			}

			// 부위 복원
			if (workoutFormData.bodyPart.length > 0) {
				setSelectedBodyParts(workoutFormData.bodyPart)
				form.setFieldsValue({
					bodyPart: workoutFormData.bodyPart,
				})
			}

			// 운동 및 세트 정보 복원
			if (workoutFormData.exercises.length > 0) {
				setExercises(workoutFormData.exercises)
			}

			setIsInitialized(true)
		} else if (selectedExercises.length > 0 && !isInitialized) {
			// Redux store에서 선택한 운동들을 가져와서 초기화
			const uniqueBodyParts = Array.from(
				new Set(selectedExercises.map((e: SelectedExercise) => e.agonist)),
			) as string[]
			setSelectedBodyParts(uniqueBodyParts)

			// Form에 값 설정
			form.setFieldsValue({
				bodyPart: uniqueBodyParts,
			})

			// 선택한 운동들을 exercises state로 변환
			const initialExercises: ExerciseData[] = selectedExercises.map(
				(exercise: SelectedExercise) => ({
					exercise: exercise.title,
					sets: [
						{ weight: null, reps: null },
						{ weight: null, reps: null },
						{ weight: null, reps: null },
					],
				}),
			)
			setExercises(initialExercises)

			setIsInitialized(true)
		}
	}, [workoutFormData, selectedExercises, form, isInitialized])

	// 운동 목록이 로드되고 초기화가 완료되면 선택한 운동들을 설정
	useEffect(() => {
		if (isInitialized && exerciseList.length > 0) {
			// 현재 exercises에 있는 운동 이름들
			const existingExerciseNames = exercises
				.map(ex => ex.exercise)
				.filter(name => name !== '')

			// selectedExercises에 있는 운동 이름들
			const selectedExerciseNames = selectedExercises.map(
				(se: SelectedExercise) => se.title,
			)

			// selectedExercises에서 아직 exercises에 없는 운동들 찾기 (추가할 운동)
			const newExercises = selectedExercises.filter(
				(se: SelectedExercise) => !existingExerciseNames.includes(se.title),
			)

			// exercises에 있지만 selectedExercises에 없는 운동들 찾기 (제거할 운동)
			const exercisesToRemove = existingExerciseNames.filter(
				name => !selectedExerciseNames.includes(name),
			)

			// 새로운 운동이 있으면 추가
			if (newExercises.length > 0) {
				const exercisesToAdd: ExerciseData[] = newExercises.map(
					(exercise: SelectedExercise) => ({
						exercise: exercise.title,
						sets: [
							{ weight: null, reps: null },
							{ weight: null, reps: null },
							{ weight: null, reps: null },
						],
					}),
				)

				// 기존 exercises에 새로운 운동들 추가
				setExercises(prev => [...prev, ...exercisesToAdd])

				// 새로운 운동의 부위도 selectedBodyParts에 추가
				const newBodyParts = newExercises
					.map((se: SelectedExercise) => se.agonist)
					.filter((part: string) => !selectedBodyParts.includes(part))

				if (newBodyParts.length > 0) {
					setSelectedBodyParts(prev => [...prev, ...newBodyParts])
					form.setFieldsValue({
						bodyPart: [...selectedBodyParts, ...newBodyParts],
					})
				}
			}

			// 제거할 운동이 있으면 exercises에서 제거
			if (exercisesToRemove.length > 0) {
				setExercises(prev =>
					prev.filter(ex => !exercisesToRemove.includes(ex.exercise)),
				)

				// 제거된 운동의 부위가 다른 운동에서 사용되지 않으면 selectedBodyParts에서도 제거
				const remainingExerciseNames = exercises
					.map(ex => ex.exercise)
					.filter(name => name !== '' && !exercisesToRemove.includes(name))

				// 남은 운동들의 부위 확인
				const remainingBodyParts = new Set<string>()
				selectedExercises.forEach((se: SelectedExercise) => {
					if (remainingExerciseNames.includes(se.title)) {
						remainingBodyParts.add(se.agonist)
					}
				})

				// 제거된 운동의 부위가 남은 운동에서 사용되지 않으면 제거
				const bodyPartsToRemove = selectedBodyParts.filter(
					part => !remainingBodyParts.has(part),
				)

				if (bodyPartsToRemove.length > 0) {
					setSelectedBodyParts(prev =>
						prev.filter(part => !bodyPartsToRemove.includes(part)),
					)
					form.setFieldsValue({
						bodyPart: selectedBodyParts.filter(
							part => !bodyPartsToRemove.includes(part),
						),
					})
				}
			}

			// 처음 초기화할 때만 전체 설정
			if (existingExerciseNames.length === 0 && selectedExercises.length > 0) {
				const initialExercises: ExerciseData[] = selectedExercises.map(
					(exercise: SelectedExercise) => ({
						exercise: exercise.title,
						sets: [
							{ weight: null, reps: null },
							{ weight: null, reps: null },
							{ weight: null, reps: null },
						],
					}),
				)

				setExercises(initialExercises)
			}
		}
	}, [selectedExercises, isInitialized, exerciseList])

	// 부위 선택 시 해당 부위들의 운동 목록 가져오기
	useEffect(() => {
		const fetchExercises = async () => {
			if (selectedBodyParts.length === 0) {
				setExerciseList([])
				return
			}

			setLoading(true)
			try {
				// 여러 부위에 대해 OR 조건으로 운동 목록 가져오기
				const { data, error } = await supabase
					.from('workoutList')
					.select('title, agonist')
					.in('agonist', selectedBodyParts)

				if (error) {
					console.error(error)
					setExerciseList([])
				} else if (data) {
					// 중복 제거
					const uniqueExercises = Array.from(
						new Map(data.map(item => [item.title, item])).values(),
					)
					setExerciseList(uniqueExercises)
				}
			} catch (error) {
				console.error(error)
				setExerciseList([])
			}
			setLoading(false)
		}

		fetchExercises()
	}, [selectedBodyParts])

	// 부위 변경 시 운동 목록 초기화 (초기화된 후에만)
	useEffect(() => {
		if (selectedBodyParts.length > 0 && isInitialized) {
			// Redux store에서 온 경우가 아니면 초기화
			if (selectedExercises.length === 0) {
				setExercises([
					{
						exercise: '',
						sets: [
							{ weight: null, reps: null },
							{ weight: null, reps: null },
							{ weight: null, reps: null },
						],
					},
				])
			}
		}
	}, [selectedBodyParts, isInitialized, selectedExercises])

	// 다른 운동 추가 - 운동 선택 페이지로 이동
	const addExercise = () => {
		// querystring의 userId와 userName이 있으면 함께 전달
		const queryParams = new URLSearchParams()
		queryParams.set('selectMode', 'true')
		const userIdFromQuery = searchParams.get('userId')
		const userNameFromQuery = searchParams.get('userName')
		if (userIdFromQuery) {
			queryParams.set('userId', userIdFromQuery)
			if (userNameFromQuery) {
				queryParams.set('userName', userNameFromQuery)
			}
		}
		navigate(`/workout/list?${queryParams.toString()}`)
	}

	// 운동 삭제
	const removeExercise = (exerciseIndex: number) => {
		if (exercises.length > 1) {
			const exerciseToRemove = exercises[exerciseIndex]

			// Redux store에서도 해당 운동 제거
			if (exerciseToRemove.exercise) {
				// selectedExercises에서 해당 운동 찾기
				const exerciseInStore = selectedExercises.find(
					se => se.title === exerciseToRemove.exercise,
				)
				if (exerciseInStore) {
					dispatch(removeExerciseFromStore(exerciseInStore))
				}
			}

			// 로컬 state에서 제거
			const newExercises = exercises.filter((_, i) => i !== exerciseIndex)
			setExercises(newExercises)
			// Redux에 저장
			saveFormDataToRedux(newExercises)
		}
	}

	// 폼 데이터를 Redux에 저장
	const saveFormDataToRedux = (currentExercises?: ExerciseData[]) => {
		const formValues = form.getFieldsValue()
		// currentExercises가 전달되면 사용, 없으면 exercises state 사용
		const exercisesToSave = currentExercises || exercises

		// 날짜와 시간이 있으면 모두 저장, 없어도 세트 정보는 저장
		const workoutDate = formValues.workoutDate
			? formValues.workoutDate.toISOString()
			: workoutFormData?.workoutDate || null
		// 시간을 문자열로 조합
		const workoutTime =
			formValues.workoutTimeHour && formValues.workoutTimeMinute
				? dayjs(
						`${formValues.workoutTimeHour}:${formValues.workoutTimeMinute}`,
						'HH:mm',
					).toISOString()
				: workoutFormData?.workoutTime || null
		const workoutEndTime =
			formValues.workoutEndTimeHour && formValues.workoutEndTimeMinute
				? dayjs(
						`${formValues.workoutEndTimeHour}:${formValues.workoutEndTimeMinute}`,
						'HH:mm',
					).toISOString()
				: workoutFormData?.workoutEndTime || null

		// 세트 정보는 항상 저장 (날짜/시간이 없어도)
		// exercisesToSave를 깊은 복사하여 저장
		const exercisesToSaveCopy = exercisesToSave.map(ex => ({
			exercise: ex.exercise,
			sets: ex.sets.map(set => ({
				weight: set.weight,
				reps: set.reps,
			})),
		}))

		dispatch(
			setWorkoutFormData({
				workoutDate: workoutDate,
				workoutTime: workoutTime,
				workoutEndTime: workoutEndTime,
				bodyPart: formValues.bodyPart || selectedBodyParts,
				exercises: exercisesToSaveCopy,
			}),
		)
	}

	// 운동 종목 변경
	const updateExercise = (exerciseIndex: number, exerciseName: string) => {
		const newExercises = [...exercises]
		newExercises[exerciseIndex] = {
			...newExercises[exerciseIndex],
			exercise: exerciseName,
		}
		setExercises(newExercises)
		// Redux에 저장
		saveFormDataToRedux(newExercises)
	}

	// 세트 추가
	const addSet = (exerciseIndex: number) => {
		const newExercises = [...exercises]
		newExercises[exerciseIndex].sets.push({ weight: null, reps: null })
		setExercises(newExercises)
		// Redux에 저장
		saveFormDataToRedux(newExercises)
	}

	// 세트 삭제
	const removeSet = (exerciseIndex: number, setIndex: number) => {
		const newExercises = [...exercises]
		if (newExercises[exerciseIndex].sets.length > 1) {
			newExercises[exerciseIndex].sets = newExercises[
				exerciseIndex
			].sets.filter((_, i) => i !== setIndex)
			setExercises(newExercises)
			// Redux에 저장
			saveFormDataToRedux(newExercises)
		}
	}

	// 세트 값 업데이트
	const updateSet = (
		exerciseIndex: number,
		setIndex: number,
		field: 'weight' | 'reps',
		value: number | null,
	) => {
		const newExercises = [...exercises]
		// 세트 정보 깊은 복사
		newExercises[exerciseIndex] = {
			...newExercises[exerciseIndex],
			sets: newExercises[exerciseIndex].sets.map((set, idx) =>
				idx === setIndex ? { ...set, [field]: value } : { ...set },
			),
		}
		setExercises(newExercises)
		// Redux에 저장 (newExercises를 명시적으로 전달)
		setTimeout(() => {
			saveFormDataToRedux(newExercises)
		}, 0)
	}

	const onFinish: FormProps<FormData>['onFinish'] = async values => {
		// 저장 중 상태로 변경
		setSaving(true)
		try {
			// querystring에서 userId 가져오기 (트레이너가 회원을 선택한 경우)
			const userIdFromQuery = searchParams.get('userId')
			const userType = localStorage.getItem('userType')
			const isTrainer = userType === 'trainer'

			// 트레이너인 경우 querystring에 userId가 반드시 있어야 함
			if (isTrainer && !userIdFromQuery) {
				alert('회원을 선택한 후 일지를 작성해주세요.')
				return
			}

			// userId 결정: querystring에 있으면 사용, 없으면 localStorage에서 가져오기
			const userId = userIdFromQuery || localStorage.getItem('userId')
			if (!userId) {
				alert('로그인이 필요합니다.')
				return
			}

			// 운동 날짜와 시간을 합쳐서 문자열로 변환 (text 타입이므로)
			const workoutStartDateTime = `${values.workoutDate.format('YYYY-MM-DD')} ${values.workoutTimeHour.padStart(2, '0')}:${values.workoutTimeMinute.padStart(2, '0')}`
			const workoutEndDateTime = `${values.workoutDate.format('YYYY-MM-DD')} ${values.workoutEndTimeHour.padStart(2, '0')}:${values.workoutEndTimeMinute.padStart(2, '0')}`

			// 각 부위별로 세션 생성
			for (const bodyPart of values.bodyPart) {
				// 해당 부위의 운동들만 필터링
				const exercisesForBodyPart = exercises.filter(ex => {
					if (!ex.exercise) return false
					// 운동 목록에서 해당 운동의 부위 확인
					const exerciseInfo = exerciseList.find(
						item => item.title === ex.exercise,
					)
					// 해당 부위의 운동인지 확인
					return exerciseInfo?.agonist === bodyPart
				})

				// 해당 부위에 운동이 없으면 세션 생성하지 않음
				if (exercisesForBodyPart.length === 0) continue

				// 입력된 세트가 있는 운동만 확인
				const exercisesWithSets = exercisesForBodyPart.filter(ex => {
					const validSets = ex.sets.filter(
						set => set.weight !== null && set.reps !== null,
					)
					return validSets.length > 0
				})

				if (exercisesWithSets.length === 0) continue

				// 1. workout_sessions에 insert (날짜+시간을 datetime 형식으로 저장)
				const sessionInsertData: any = {
					workout_date: workoutStartDateTime,
					workout_end_date: workoutEndDateTime,
					body_part: bodyPart,
					user_id: userId,
				}

				// 리뷰가 있는 경우 userType에 따라 저장
				if (values.review && values.review.trim()) {
					if (isTrainer) {
						sessionInsertData.trainer_review = values.review.trim()
					} else {
						sessionInsertData.user_review = values.review.trim()
					}
				}

				const { data: sessionData, error: sessionError } = await supabase
					.from('workout_sessions')
					.insert([sessionInsertData])
					.select()
					.single()

				if (sessionError) {
					console.error('세션 저장 실패:', sessionError)
					alert(`세션 저장 실패: ${bodyPart}`)
					continue
				}

				const sessionId = sessionData.id

				// 각 운동에 대해 저장 (순서 정보 포함)
				for (let i = 0; i < exercisesWithSets.length; i++) {
					const exerciseData = exercisesWithSets[i]
					if (!exerciseData.exercise) continue

					// 입력된 세트만 필터링 (weight와 reps가 모두 입력된 세트)
					const validSets = exerciseData.sets.filter(
						set => set.weight !== null && set.reps !== null,
					)

					if (validSets.length === 0) continue

					// 전체 exercises 배열에서의 순서 찾기 (부위별이 아닌 전체 순서)
					const globalOrder = exercises.findIndex(
						ex => ex.exercise === exerciseData.exercise,
					)

					// 2. exercises에 insert (order 포함)
					const { data: exerciseDataResult, error: exerciseError } =
						await supabase
							.from('exercises')
							.insert([
								{
									session_id: sessionId,
									exercise_name: exerciseData.exercise,
									total_sets: validSets.length,
									order: globalOrder >= 0 ? globalOrder + 1 : i + 1,
								},
							])
							.select()
							.single()

					if (exerciseError) {
						console.error('운동 저장 실패:', exerciseError)
						alert(`운동 저장 실패: ${exerciseData.exercise}`)
						continue
					}

					const exerciseId = exerciseDataResult.id

					// 3. exercise_sets에 insert
					const setsToInsert = validSets.map((set, index) => ({
						exercise_id: exerciseId,
						set_order: index + 1,
						weight: set.weight!,
						reps: set.reps!,
					}))

					const { error: setsError } = await supabase
						.from('exercise_sets')
						.insert(setsToInsert)

					if (setsError) {
						console.error('세트 저장 실패:', setsError)
						alert(`세트 저장 실패: ${exerciseData.exercise}`)
						continue
					}
				}
			}

			// 저장 성공
			alert('저장 완료!')
			// 저장 후 선택한 운동 초기화
			dispatch(clearExercises())
			// Redux에 저장된 폼 데이터도 초기화
			dispatch(clearWorkoutFormData())
			// 폼 초기화
			form.resetFields()
			setExercises([
				{
					exercise: '',
					sets: [
						{ weight: null, reps: null },
						{ weight: null, reps: null },
						{ weight: null, reps: null },
					],
				},
			])
			setSelectedBodyParts([])
			// 트레이너가 회원을 선택한 경우 캘린더로 이동 (userId와 userName 포함)
			const userNameFromQuery = searchParams.get('userName')
			if (userIdFromQuery) {
				const queryParams = new URLSearchParams()
				queryParams.set('userId', userIdFromQuery)
				if (userNameFromQuery) {
					queryParams.set('userName', userNameFromQuery)
				}
				navigate(`/workout/calendar?${queryParams.toString()}`)
			} else {
				navigate('/workout/calendar')
			}
		} catch (error) {
			console.error('저장 중 오류 발생:', error)
			alert('저장 중 오류가 발생했습니다.')
		} finally {
			// 저장 완료 후 로딩 상태 해제
			setSaving(false)
		}
	}

	const bodyPartOptions = [
		{ value: '가슴', label: '가슴' },
		{ value: '등', label: '등' },
		{ value: '어깨', label: '어깨' },
		{ value: '팔', label: '팔' },
		{ value: '하체', label: '하체' },
		{ value: '유산소', label: '유산소' },
	]

	return (
		<TonsilLayout>
			<FormContainer>
				<h2 style={{ marginBottom: 20, color: '#1a1a1a' }}>운동 일지 작성</h2>
				<Form form={form} layout="vertical" onFinish={onFinish}>
					<FormItem>
						<Label>운동 날짜</Label>
						<Form.Item
							name="workoutDate"
							rules={[{ required: true, message: '운동 날짜를 선택해주세요' }]}
							initialValue={dayjs()}
						>
							<DatePicker
								style={{ width: '100%' }}
								format="YYYY-MM-DD"
								placeholder="운동 날짜를 선택하세요"
								onChange={() => {
									setTimeout(() => saveFormDataToRedux(), 100)
								}}
							/>
						</Form.Item>
					</FormItem>
					<FormItem>
						<Label>운동 시작 시간</Label>
						<div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
							<Form.Item
								name="workoutTimeHour"
								rules={[{ required: true, message: '시를 선택해주세요' }]}
								style={{ flex: 1, marginBottom: 0 }}
							>
								<Select
									placeholder="시"
									onChange={() => {
										setTimeout(() => saveFormDataToRedux(), 100)
									}}
								>
									{Array.from({ length: 24 }, (_, i) => (
										<Select.Option key={i} value={String(i).padStart(2, '0')}>
											{String(i).padStart(2, '0')}시
										</Select.Option>
									))}
								</Select>
							</Form.Item>
							<span style={{ color: '#666' }}>:</span>
							<Form.Item
								name="workoutTimeMinute"
								rules={[{ required: true, message: '분을 선택해주세요' }]}
								style={{ flex: 1, marginBottom: 0 }}
							>
								<Select
									placeholder="분"
									onChange={() => {
										setTimeout(() => saveFormDataToRedux(), 100)
									}}
								>
									{Array.from({ length: 6 }, (_, i) => {
										const minute = i * 10
										return (
											<Select.Option
												key={minute}
												value={String(minute).padStart(2, '0')}
											>
												{String(minute).padStart(2, '0')}분
											</Select.Option>
										)
									})}
								</Select>
							</Form.Item>
						</div>
					</FormItem>
					<FormItem>
						<Label>운동 종료 시간</Label>
						<div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
							<Form.Item
								name="workoutEndTimeHour"
								rules={[{ required: true, message: '시를 선택해주세요' }]}
								style={{ flex: 1, marginBottom: 0 }}
							>
								<Select
									placeholder="시"
									onChange={() => {
										setTimeout(() => saveFormDataToRedux(), 100)
									}}
								>
									{Array.from({ length: 24 }, (_, i) => (
										<Select.Option key={i} value={String(i).padStart(2, '0')}>
											{String(i).padStart(2, '0')}시
										</Select.Option>
									))}
								</Select>
							</Form.Item>
							<span style={{ color: '#666' }}>:</span>
							<Form.Item
								name="workoutEndTimeMinute"
								rules={[{ required: true, message: '분을 선택해주세요' }]}
								style={{ flex: 1, marginBottom: 0 }}
							>
								<Select
									placeholder="분"
									onChange={() => {
										setTimeout(() => saveFormDataToRedux(), 100)
									}}
								>
									{Array.from({ length: 6 }, (_, i) => {
										const minute = i * 10
										return (
											<Select.Option
												key={minute}
												value={String(minute).padStart(2, '0')}
											>
												{String(minute).padStart(2, '0')}분
											</Select.Option>
										)
									})}
								</Select>
							</Form.Item>
						</div>
					</FormItem>
					<FormItem>
						<Label>운동 부위</Label>
						<Form.Item
							name="bodyPart"
							rules={[{ required: true, message: '운동 부위를 선택해주세요' }]}
							initialValue={selectedBodyParts}
						>
							<Select
								mode="multiple"
								placeholder="운동 부위를 선택하세요"
								value={selectedBodyParts}
								disabled={selectedExercises.length > 0}
								onChange={value => {
									setSelectedBodyParts(value)
									// Redux store에서 온 경우가 아니면 초기화
									if (selectedExercises.length === 0) {
										setExercises([
											{
												exercise: '',
												sets: [
													{ weight: null, reps: null },
													{ weight: null, reps: null },
													{ weight: null, reps: null },
												],
											},
										])
									}
								}}
								options={bodyPartOptions}
							/>
						</Form.Item>
					</FormItem>

					{exercises.map((exerciseData, exerciseIndex) => (
						<div
							key={exerciseIndex}
							style={{
								padding: '20px',
								background: '#f8f9fa',
								borderRadius: '12px',
								border: '1px solid #e9ecef',
								marginBottom: '20px',
							}}
						>
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									marginBottom: '20px',
								}}
							>
								<h3 style={{ margin: 0, color: '#1a1a1a', fontSize: '16px' }}>
									운동 {exerciseIndex + 1}
								</h3>
								{exercises.length > 1 && (
									<DeleteButton
										type="default"
										icon={<DeleteOutlined />}
										onClick={() => removeExercise(exerciseIndex)}
										danger
									>
										운동 삭제
									</DeleteButton>
								)}
							</div>

							<FormItem>
								<Label>운동 종목</Label>
								<Select
									showSearch
									placeholder={
										selectedBodyParts.length > 0
											? '운동 종목을 선택하거나 검색하세요'
											: '먼저 운동 부위를 선택해주세요'
									}
									disabled={
										selectedBodyParts.length === 0 ||
										loading ||
										(selectedExercises.length > 0 &&
											selectedExercises.some(
												se => se.title === exerciseData.exercise,
											))
									}
									loading={loading}
									value={exerciseData.exercise || undefined}
									onChange={value => updateExercise(exerciseIndex, value)}
									options={exerciseList.map(ex => ({
										value: ex.title,
										label: ex.title,
									}))}
									filterOption={(input, option) =>
										(option?.label ?? '')
											.toLowerCase()
											.includes(input.toLowerCase())
									}
								/>
							</FormItem>

							<FormItem>
								<Label>세트 정보</Label>
								<SetsContainer>
									{exerciseData.sets.map((set, setIndex) => (
										<SetItem key={setIndex}>
											<SetLabel>{setIndex + 1}세트</SetLabel>
											<InputGroup>
												<InputNumber
													placeholder="무게"
													min={0}
													step={0.5}
													value={set.weight}
													onChange={value =>
														updateSet(exerciseIndex, setIndex, 'weight', value)
													}
													style={{ flex: 1 }}
													addonAfter="kg"
												/>
												<span style={{ color: '#666' }}>×</span>
												<InputNumber
													placeholder="횟수"
													min={0}
													value={set.reps}
													onChange={value =>
														updateSet(exerciseIndex, setIndex, 'reps', value)
													}
													style={{ flex: 1 }}
													addonAfter="회"
												/>
											</InputGroup>
											{exerciseData.sets.length > 1 && (
												<DeleteButton
													type="default"
													icon={<DeleteOutlined />}
													onClick={() => removeSet(exerciseIndex, setIndex)}
													danger
												>
													삭제
												</DeleteButton>
											)}
										</SetItem>
									))}
								</SetsContainer>
								<AddButton
									type="primary"
									icon={<PlusOutlined />}
									onClick={() => addSet(exerciseIndex)}
								>
									세트 추가
								</AddButton>
							</FormItem>
						</div>
					))}

					<div style={{ marginTop: '24px', marginBottom: '24px' }}>
						<AddButton
							type="primary"
							icon={<PlusOutlined />}
							onClick={addExercise}
						>
							다른 운동 추가하기
						</AddButton>
					</div>

					<Form.Item
						name="review"
						label="운동 리뷰"
						style={{ marginTop: '24px' }}
					>
						<Input.TextArea
							rows={4}
							placeholder="오늘의 운동에 대한 리뷰를 작성해주세요 (선택사항)"
							maxLength={500}
							showCount
						/>
					</Form.Item>

					<Form.Item style={{ marginTop: '8px', marginBottom: 0 }}>
						<SubmitButton type="primary" htmlType="submit" loading={saving}>
							{saving ? '저장중입니다...' : '저장하기'}
						</SubmitButton>
					</Form.Item>
				</Form>
			</FormContainer>
		</TonsilLayout>
	)
}
