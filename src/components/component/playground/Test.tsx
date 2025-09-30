import { useState, useRef } from 'react'
import './test.css'
import { Button, message } from 'antd'

export const Test = () => {
	const [, setUsers] = useState<string[]>([])
	const [shuffled, setShuffled] = useState<string[]>([])
	const [isRolling, setIsRolling] = useState(false)
	const [winner, setWinner] = useState<string>('')
	const [userInput, setUserInput] = useState('')

	const loadoutRef = useRef<HTMLTableRowElement>(null)
	const logRef = useRef<HTMLDivElement>(null)

	const [messageApi, contextHolder] = message.useMessage()

	// 배열 셔플 함수
	const shuffleArray = (array: string[]): string[] => {
		const shuffled = [...array]
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))
			;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
		}
		return shuffled
	}

	// 랜덤 숫자 생성 함수
	const randomEx = (min: number, max: number): number => {
		return Math.floor(Math.random() * (max - min + 1) + min)
	}

	// 롤 버튼 클릭 핸들러
	const handleRoll = () => {
		const lines = userInput.split('\n').filter(line => line.trim().length > 0)

		if (lines.length < 2) {
			messageApi.warning({
				content: '최소 2개(줄) 이상의 음식을 입력해주세요!',
				duration: 3,
			})
			return
		}

		setUsers(lines)
		setIsRolling(true)
		setWinner('')

		const insertTimes = lines.length < 10 ? 20 : 10
		const durationTime = lines.length < 10 ? 5000 : 10000

		let scrollSize = 0
		const newShuffled: string[] = []

		// 여러 번 셔플하여 롤링 효과 생성
		for (let times = 0; times < insertTimes; times++) {
			const shuffledUsers = shuffleArray(lines)
			newShuffled.push(...shuffledUsers)
			scrollSize += lines.length * 192
		}

		setShuffled(newShuffled)

		// 애니메이션 시작
		if (loadoutRef.current) {
			// 이전 애니메이션 CSS 초기화
			loadoutRef.current.style.transition = 'none'
			loadoutRef.current.style.left = '100%'

			const diff = Math.round(scrollSize / 2)
			const finalDiff = randomEx(diff - 300, diff + 300)

			setTimeout(() => {
				if (loadoutRef.current) {
					// 1단계: 조금 더 느리게 시작 (70% 거리)
					const firstDistance = Math.round(finalDiff * 0.7)
					loadoutRef.current.style.transition = `left ${durationTime * 0.5}ms ease-out`
					loadoutRef.current.style.left = `-${firstDistance}px`

					setTimeout(() => {
						// 400ms 정지 구간 - 멈춰있다가 다시 움직이는 효과
						setTimeout(() => {
							if (loadoutRef.current) {
								// 2단계: 앞으로 가지 말고 뒤로 갈 수도 있는 효과
								const secondDistance = finalDiff - firstDistance
								// 뒤로 갈 확률 30%
								const shouldGoBack = Math.random() < 0.5
								const finalPosition = shouldGoBack
									? firstDistance - Math.round(secondDistance * 0.3) // 뒤로 가기
									: finalDiff // 앞으로 가기

								loadoutRef.current.style.transition = `left ${durationTime * 1.5}ms cubic-bezier(0.1, 0.1, 0.1, 0.9)`
								loadoutRef.current.style.left = `-${finalPosition}px`

								setTimeout(() => {
									// 승자 결정
									const center = window.innerWidth / 2
									const cells = loadoutRef.current?.querySelectorAll('td')
									if (cells) {
										cells.forEach(cell => {
											const rect = cell.getBoundingClientRect()
											if (rect.left < center && rect.left + 185 > center) {
												const winnerName = cell.textContent || ''
												setWinner(winnerName)
											}
										})
									}
									setIsRolling(false)
								}, durationTime * 1.5)
							}
						}, 400) // 400ms 정지
					}, durationTime * 0.5)
				}
			}, 100)
		}
	}

	return (
		<div className="container">
			<div className="row">
				<div className="col-md-6 col-md-offset-3">
					<div className="page-header">
						<h1>🎲🎲🎲</h1>
					</div>
				</div>
			</div>

			<div className="row topbox">
				<div className="col-md-6 col-md-offset-3 rollbox">
					<div className="line"></div>
					<table>
						<tr ref={loadoutRef} id="loadout">
							{shuffled.map((user, index) => (
								<td key={index}>
									<div className="roller">
										<div>{user}</div>
									</div>
								</td>
							))}
						</tr>
					</table>
				</div>
			</div>
			{contextHolder}
			<div className="row">
				<div className="col-md-6 col-md-offset-3">
					<Button
						id="roll"
						className="btn btn-success form-control"
						onClick={handleRoll}
						disabled={isRolling}
					>
						{isRolling ? '굴러가는중....' : '굴려!'}
					</Button>
				</div>
			</div>

			<div className="row flex-container">
				<div className="flex-item">
					<div className="food-input-container">
						<h3 className="food-input-title">🍽️ 음식 목록 입력</h3>
						<textarea
							className="form-control food-textarea"
							rows={8}
							value={userInput}
							onChange={e => setUserInput(e.target.value)}
							placeholder="예시:&#10;김치찌개&#10;된장찌개&#10;불고기&#10;치킨&#10;피자"
						/>
						<div className="food-help-text">
							💡 각 음식을 한 줄씩 입력하세요
						</div>
					</div>
				</div>

				<div className="flex-item">
					<div className="winner-container">
						<div id="log" ref={logRef} className="winner-content">
							{winner ? (
								<div>
									<div className="winner-title">🏆 THE WINNER IS</div>
									<div className="winner-badge">
										<span className="winner-name">{winner}</span>
									</div>
									<div className="winner-congrats">🎉 당첨!</div>
								</div>
							) : (
								<div className="waiting-message">🎲 굴려 굴려!</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
