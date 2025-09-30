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
					// 새로운 애니메이션 시작
					loadoutRef.current.style.transition = `left ${durationTime}ms ease-out`
					loadoutRef.current.style.left = `-${finalDiff}px`

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
					}, durationTime)
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

			<div
				className="row"
				style={{
					display: 'flex',
					gap: '20px',
					justifyContent: 'center',
					alignItems: 'stretch',
					marginTop: '40px',
				}}
			>
				<div style={{ flex: '1', maxWidth: '400px' }}>
					<div
						style={{
							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							padding: '20px',
							borderRadius: '15px',
							boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
							border: '1px solid rgba(255,255,255,0.1)',
							backdropFilter: 'blur(10px)',
						}}
					>
						<h3
							style={{
								color: 'white',
								textAlign: 'center',
								marginBottom: '15px',
								fontSize: '18px',
								fontWeight: 'bold',
								textShadow: '0 2px 4px rgba(0,0,0,0.3)',
							}}
						>
							🍽️ 음식 목록 입력
						</h3>
						<textarea
							className="form-control inputbox"
							rows={8}
							value={userInput}
							onChange={e => setUserInput(e.target.value)}
							placeholder="예시:&#10;김치찌개&#10;된장찌개&#10;불고기&#10;치킨&#10;피자"
							style={{
								background: 'rgba(255,255,255,0.9)',
								border: '2px solid rgba(255,255,255,0.3)',
								borderRadius: '10px',
								padding: '15px',
								fontSize: '14px',
								lineHeight: '1.5',
								resize: 'vertical',
								boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
								transition: 'all 0.3s ease',
								color: '#000000',
							}}
							onFocus={e => {
								e.target.style.border = '2px solid #ffd700'
								e.target.style.boxShadow = '0 0 10px rgba(255,215,0,0.3)'
							}}
							onBlur={e => {
								e.target.style.border = '2px solid rgba(255,255,255,0.3)'
								e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.1)'
							}}
						/>
						<div
							style={{
								color: 'rgba(255,255,255,0.8)',
								fontSize: '12px',
								textAlign: 'center',
								marginTop: '8px',
								fontStyle: 'italic',
							}}
						>
							💡 각 음식을 한 줄씩 입력하세요
						</div>
					</div>
				</div>

				<div style={{ flex: '1', maxWidth: '400px' }}>
					<div
						style={{
							background: 'linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)',
							padding: '20px',
							borderRadius: '15px',
							boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
							border: '1px solid rgba(255,255,255,0.1)',
							backdropFilter: 'blur(10px)',
							height: '100%',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<div
							id="log"
							ref={logRef}
							style={{ textAlign: 'center', width: '100%' }}
						>
							{winner ? (
								<div>
									<div
										style={{
											color: 'white',
											fontSize: '20px',
											fontWeight: 'bold',
											marginBottom: '20px',
											textShadow: '0 2px 4px rgba(0,0,0,0.3)',
											textTransform: 'uppercase',
											letterSpacing: '1px',
										}}
									>
										🏆 THE WINNER IS
									</div>
									<div
										style={{
											background: 'rgba(255,255,255,0.2)',
											padding: '20px 30px',
											borderRadius: '25px',
											border: '2px solid rgba(255,255,255,0.3)',
											boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
											display: 'inline-block',
										}}
									>
										<span
											style={{
												color: '#fff',
												fontSize: '32px',
												fontWeight: 'bold',
												textShadow: '0 2px 4px rgba(0,0,0,0.5)',
												display: 'block',
											}}
										>
											{winner}
										</span>
									</div>
									<div
										style={{
											color: 'rgba(255,255,255,0.8)',
											fontSize: '16px',
											marginTop: '15px',
											fontStyle: 'italic',
										}}
									>
										🎉 당첨!
									</div>
								</div>
							) : (
								<div
									style={{
										color: 'rgba(255,255,255,0.7)',
										fontSize: '16px',
										fontStyle: 'italic',
										textAlign: 'center',
									}}
								>
									🎲 굴려 굴려!
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
