import { Card, Progress, Typography } from 'antd'
import { styled } from 'styled-components'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

const { Title, Text } = Typography

const Container = styled.div`
	padding: 24px;
	margin: 20px;
	background: #fff;
	border-radius: 12px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

	@media screen and (max-width: 768px) {
		padding: 16px;
		margin: 16px;
	}
`

const CardContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	gap: 20px;
	margin-top: 24px;

	@media screen and (max-width: 768px) {
		grid-template-columns: 1fr;
		gap: 16px;
	}
`

const StyledCard = styled(Card)`
	border-radius: 12px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	transition: all 0.3s ease;

	&:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
		transform: translateY(-2px);
	}
`

const ProgressContainer = styled.div`
	margin-top: 16px;
`

const InfoText = styled(Text)`
	color: #666;
	font-size: 14px;
	margin-top: 8px;
	display: block;
`

type FatigueData = {
	bodyPart: string
	fatigueLevel: number
	lastUpdated?: string
}

export const FatigueLevel = () => {
	const [searchParams] = useSearchParams()
	const userId = searchParams.get('userId')
	const [fatigueData, setFatigueData] = useState<FatigueData[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (userId) {
			fetchFatigueData()
		}
	}, [userId])

	const fetchFatigueData = async () => {
		setLoading(true)
		try {
			// TODO: 실제 API 호출로 변경
			// 현재는 예시 데이터
			const bodyParts = ['가슴', '등', '어깨', '팔', '하체']
			const mockData: FatigueData[] = bodyParts.map(part => ({
				bodyPart: part,
				fatigueLevel: Math.floor(Math.random() * 100),
				lastUpdated: new Date().toISOString(),
			}))
			setFatigueData(mockData)
		} catch (error) {
			console.error('Error fetching fatigue data:', error)
		} finally {
			setLoading(false)
		}
	}

	const getProgressColor = (level: number) => {
		if (level >= 80) return '#ef4444' // 빨강 - 매우 피로
		if (level >= 60) return '#f59e0b' // 주황 - 피로
		if (level >= 40) return '#eab308' // 노랑 - 보통
		if (level >= 20) return '#84cc16' // 연두 - 양호
		return '#10b981' // 초록 - 매우 양호
	}

	const getFatigueStatus = (level: number) => {
		if (level >= 80) return '매우 피로'
		if (level >= 60) return '피로'
		if (level >= 40) return '보통'
		if (level >= 20) return '양호'
		return '매우 양호'
	}

	if (loading) {
		return (
			<Container>
				<Title level={3}>로딩 중...</Title>
			</Container>
		)
	}

	return (
		<Container>
			<Text type="secondary" style={{ fontSize: 16 }}>
				각 부위별 피로도 수준을 확인할 수 있습니다.
			</Text>

			<CardContainer>
				{fatigueData.map((data, index) => (
					<StyledCard key={index} title={data.bodyPart}>
						<ProgressContainer>
							<Progress
								percent={data.fatigueLevel}
								strokeColor={getProgressColor(data.fatigueLevel)}
								format={percent => `${percent}%`}
							/>
							<InfoText>상태: {getFatigueStatus(data.fatigueLevel)}</InfoText>
							{data.lastUpdated && (
								<InfoText>
									최종 업데이트:{' '}
									{new Date(data.lastUpdated).toLocaleDateString('ko-KR')}
								</InfoText>
							)}
						</ProgressContainer>
					</StyledCard>
				))}
			</CardContainer>
		</Container>
	)
}
