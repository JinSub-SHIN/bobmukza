import { Card, List, Tag, Space, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useState, useMemo, useEffect } from 'react'
import { styled } from 'styled-components'
import { supabase } from '../../../database/supabase'

const CardWrapper = styled.div<{ isSelected: boolean }>`
	position: relative;
	cursor: pointer;
	transition: all 0.3s ease;
`

const StyledCard = styled(Card)<{ isSelected: boolean }>`
	border-radius: 16px;
	border: none;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	overflow: hidden;
	height: 100%;
	box-sizing: border-box;

	${props =>
		props.isSelected &&
		`
		.ant-card-body {
			background: repeating-linear-gradient(
				45deg,
				#ffffff,
				#ffffff 25px,
				#f3f4f6 25px,
				#f3f4f6 27px
			) !important;
		}
	`}

	&:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
	}

	.ant-card-head {
		background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
		border: none;
		padding: 16px 20px;
		min-height: auto;
	}

	.ant-card-head-title {
		font-size: 16px;
		font-weight: 700;
		color: white;
		line-height: 1.4;
	}

	.ant-card-body {
		padding: 20px;
		background: #ffffff;
	}

	@media screen and (max-width: 768px) {
		border-radius: 12px;

		.ant-card-head {
			padding: 12px 16px;
		}

		.ant-card-head-title {
			font-size: 14px;
		}

		.ant-card-body {
			padding: 16px;
		}
	}
`

const NumberBadge = styled.div`
	position: absolute;
	top: 12px;
	right: 12px;
	width: 32px;
	height: 32px;
	border-radius: 50%;
	background: linear-gradient(135deg, #10b981 0%, #059669 100%);
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 16px;
	font-weight: 700;
	z-index: 10;
	box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
`

const CardContent = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
`

const InfoRow = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 8px;
	padding: 10px;
	background: #f8f9fa;
	border-radius: 8px;
	border-left: 3px solid #a8edea;
	transition: all 0.2s ease;

	&:hover {
		background: #f0f0f0;
		border-left-color: #fed6e3;
	}

	@media screen and (max-width: 768px) {
		padding: 8px;
		gap: 6px;
	}
`

const InfoLabel = styled.span`
	font-weight: 700;
	color: #a8edea;
	font-size: 13px;
	min-width: 60px;

	@media screen and (max-width: 768px) {
		font-size: 12px;
		min-width: 50px;
	}
`

const InfoValue = styled.span`
	color: #495057;
	font-size: 13px;
	line-height: 1.5;

	@media screen and (max-width: 768px) {
		font-size: 12px;
	}
`

const EmptyInfo = styled.div`
	padding: 20px;
	text-align: center;
	color: #999;
	font-size: 13px;
	font-style: italic;

	@media screen and (max-width: 768px) {
		padding: 16px;
		font-size: 12px;
	}
`

const FilterTag = styled(Tag)`
	padding: 6px 16px;
	font-size: 14px;
	font-weight: 600;
	border-radius: 20px;
	border: none;
	cursor: pointer;
	transition: all 0.3s ease;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

	&:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	@media screen and (max-width: 768px) {
		padding: 5px 12px;
		font-size: 13px;
	}
`

const SearchInput = styled(Input)`
	height: 48px;
	border-radius: 12px;
	border: 2px solid #e5e7eb;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	transition: all 0.3s ease;
	font-size: 15px;
	padding: 12px 16px;

	&:hover {
		border-color: #10b981;
		box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
	}

	&:focus,
	&.ant-input-focused {
		border-color: #10b981 !important;
		box-shadow: 0 4px 16px rgba(16, 185, 129, 0.25) !important;
	}

	&::placeholder {
		color: #9ca3af;
	}

	@media screen and (max-width: 768px) {
		height: 44px;
		font-size: 14px;
		padding: 10px 14px;
	}
`

type ExerciseData = {
	title: string
	antagonist?: string
	synergist?: string
	type?: string
}

type SelectedExercise = {
	title: string
	agonist: string
}

type EtcListProps = {
	selectedExercises: SelectedExercise[]
	onExerciseToggle: (exercise: SelectedExercise) => void
	agonist: string
	selectMode: boolean
}

export const EtcList = ({
	selectedExercises,
	onExerciseToggle,
	agonist,
	selectMode,
}: EtcListProps) => {
	const [data, setData] = useState<ExerciseData[]>([])
	const [loading, setLoading] = useState(true)
	const [searchText, setSearchText] = useState<string>('')

	useEffect(() => {
		fetchExercises()
	}, [])

	const fetchExercises = async () => {
		setLoading(true)
		const { data: dbData, error } = await supabase
			.from('workoutList')
			.select('*')
			.eq('agonist', '기타')

		if (error) {
			console.error(error)
			setLoading(false)
		} else if (dbData) {
			const transformedData: ExerciseData[] = dbData.map(item => {
				return {
					title: item.title || '',
					antagonist: item.antagonist || undefined,
					synergist: item.synergist || undefined,
					type: item.type || undefined,
				}
			})

			setData(transformedData)
			setLoading(false)
		}
	}

	const allTypes = useMemo(() => {
		const typeSet = new Set<string>()
		data.forEach(item => {
			if (item.type) {
				typeSet.add(item.type)
			}
		})
		return Array.from(typeSet)
	}, [data])

	const [selectedFilter, setSelectedFilter] = useState<string | null>(null)

	const toggleFilter = (key: string) => {
		setSelectedFilter(prev => {
			return prev === key ? null : key
		})
	}

	const filteredData = useMemo(() => {
		let result = data

		// type 필터 적용
		if (selectedFilter) {
			result = result.filter(item => item.type === selectedFilter)
		}

		// selectMode일 때 검색어 필터 적용
		if (selectMode && searchText.trim()) {
			result = result.filter(item =>
				item.title.toLowerCase().includes(searchText.toLowerCase()),
			)
		}

		return result
	}, [selectedFilter, data, selectMode, searchText])

	if (loading) {
		return <div>로딩 중...</div>
	}

	return (
		<div>
			{/* 검색 영역 - selectMode일 때만 표시 */}
			{selectMode && (
				<div style={{ marginBottom: 20 }}>
					<SearchInput
						prefix={
							<SearchOutlined style={{ color: '#10b981', fontSize: '18px' }} />
						}
						placeholder="운동 이름으로 검색..."
						value={searchText}
						onChange={e => setSearchText(e.target.value)}
						allowClear
						size="large"
					/>
				</div>
			)}
			{allTypes.length > 0 && (
				<Space
					wrap
					style={{
						marginBottom: 24,
						padding: '12px 0',
					}}
				>
					{allTypes.map(type => (
						<FilterTag
							key={type}
							style={{
								background:
									selectedFilter === type
										? 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
										: '#f0f0f0',
								color: selectedFilter === type ? 'white' : '#495057',
							}}
							onClick={() => toggleFilter(type)}
						>
							{type}
						</FilterTag>
					))}
				</Space>
			)}

			<List
				key={selectedFilter || 'all'}
				grid={{
					gutter: [16, 16],
					xs: 1,
					sm: 2,
					md: 3,
					lg: 4,
					xl: 4,
					xxl: 5,
				}}
				dataSource={filteredData}
				renderItem={item => {
					const exercise: SelectedExercise = {
						title: item.title,
						agonist: agonist,
					}
					const isSelected = selectedExercises.some(
						e => e.title === item.title && e.agonist === agonist,
					)

					return (
						<List.Item key={item.title}>
							<CardWrapper
								isSelected={isSelected}
								onClick={
									selectMode ? () => onExerciseToggle(exercise) : undefined
								}
							>
								{selectMode && isSelected && (
									<NumberBadge>
										{selectedExercises.findIndex(
											se =>
												se.title === exercise.title && se.agonist === agonist,
										) + 1}
									</NumberBadge>
								)}
								<StyledCard
									title={item.title}
									isSelected={isSelected && selectMode}
								>
									<CardContent>
										{item.antagonist && (
											<InfoRow>
												<InfoLabel>길항근</InfoLabel>
												<InfoValue>{item.antagonist}</InfoValue>
											</InfoRow>
										)}
										{item.synergist && (
											<InfoRow>
												<InfoLabel>협력근</InfoLabel>
												<InfoValue>{item.synergist}</InfoValue>
											</InfoRow>
										)}
										{!item.antagonist && !item.synergist && (
											<EmptyInfo>등록한 정보가 없습니다</EmptyInfo>
										)}
									</CardContent>
								</StyledCard>
							</CardWrapper>
						</List.Item>
					)
				}}
			/>
		</div>
	)
}
