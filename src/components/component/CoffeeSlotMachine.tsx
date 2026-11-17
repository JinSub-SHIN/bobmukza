import { useEffect, useRef, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { theme } from '../../styles/theme'

type Props = {
	names: string[]
	onResult?: (name: string) => void
}

const CELL_H = 56
const REEL_SPIN_MS = [2200, 2700, 3200] as const

const jackpotBlink = keyframes`
	0%,
	100% {
		box-shadow: 0 0 0 rgba(255, 90, 54, 0);
	}
	50% {
		box-shadow: 0 0 24px rgba(255, 90, 54, 0.55);
	}
`

const reelBlur = keyframes`
	0% {
		filter: blur(0);
	}
	20% {
		filter: blur(1px);
	}
	100% {
		filter: blur(0);
	}
`

const marquee = keyframes`
	0% {
		transform: translateX(0);
	}
	100% {
		transform: translateX(-50%);
	}
`

const Stage = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16px;
	width: 100%;
`

const StageCentered = styled(Stage)`
	justify-content: center;
	min-height: min(340px, 42vh);
	padding: 12px 0;
`

const EmptyStateCard = styled.div`
	width: min(100%, 340px);
	margin: 0 auto;
	padding: 32px 24px;
	text-align: center;
	border-radius: ${theme.radius};
	background: linear-gradient(
		165deg,
		rgba(255, 255, 255, 0.95) 0%,
		rgba(243, 247, 245, 0.92) 100%
	);
	border: 1px solid ${theme.line};
	box-shadow: ${theme.shadow};
`

const EmptyIcon = styled.div`
	font-size: 2.25rem;
	line-height: 1;
	margin-bottom: 12px;
`

const EmptyMessage = styled.p`
	margin: 0 0 16px;
	font-size: 0.98rem;
	font-weight: 600;
	color: ${theme.ink};
	line-height: 1.55;
`

const EmptyFair = styled.p`
	margin: 0;
	padding-top: 14px;
	border-top: 1px solid ${theme.line};
	font-size: 0.82rem;
	font-weight: 500;
	color: ${theme.inkSoft};
	line-height: 1.55;

	strong {
		color: ${theme.teal};
		font-weight: 700;
	}
`

const Cabinet = styled.div<{ $jackpot: boolean }>`
	width: min(100%, 360px);
	padding: 18px 16px 20px;
	border-radius: 20px;
	background: linear-gradient(165deg, #1f1538 0%, #352560 40%, #1a2e28 100%);
	border: 4px solid #5c4a9a;
	box-shadow: 0 22px 44px rgba(20, 35, 28, 0.28);
	${p =>
		p.$jackpot &&
		css`
			animation: ${jackpotBlink} 0.55s ease 3;
		`}
`

const MarqueeBar = styled.div`
	overflow: hidden;
	margin-bottom: 14px;
	padding: 8px 0;
	border-radius: 10px;
	background: rgba(0, 0, 0, 0.35);
	border: 1px solid rgba(255, 217, 102, 0.35);
`

const MarqueeTrack = styled.div<{ $run: boolean }>`
	display: flex;
	width: max-content;
	font-family: ${theme.fontDisplay};
	font-size: 0.85rem;
	font-weight: 700;
	color: #ffe082;
	white-space: nowrap;
	gap: 32px;

	${p =>
		p.$run &&
		css`
			animation: ${marquee} 4s linear infinite;
		`}
`

const ReelsRow = styled.div`
	display: flex;
	gap: 10px;
	justify-content: center;
	position: relative;
	padding: 12px 8px;
	border-radius: 14px;
	background: linear-gradient(180deg, #0a0a12 0%, #151525 100%);
	border: 3px solid ${theme.accent};
`

const Payline = styled.div`
	position: absolute;
	left: 6px;
	right: 6px;
	top: 50%;
	transform: translateY(-50%);
	height: ${CELL_H}px;
	border-radius: 8px;
	pointer-events: none;
	border: 2px solid rgba(255, 224, 130, 0.85);
	box-shadow:
		inset 0 0 12px rgba(255, 224, 130, 0.25),
		0 0 10px rgba(255, 224, 130, 0.2);
	z-index: 2;
`

const ReelWindow = styled.div`
	flex: 1;
	max-width: 108px;
	height: ${CELL_H}px;
	overflow: hidden;
	border-radius: 8px;
	background: #fff;
	border: 2px solid rgba(255, 255, 255, 0.2);
	position: relative;
	z-index: 1;
`

const ReelStrip = styled.div<{
	$offset: number
	$duration: number
	$spinning: boolean
}>`
	transform: translateY(${p => -p.$offset}px);
	transition: ${p =>
		p.$spinning
			? `transform ${p.$duration}ms cubic-bezier(0.12, 0.85, 0.18, 1)`
			: 'none'};
	${p =>
		p.$spinning &&
		css`
			animation: ${reelBlur} 0.4s ease;
		`}
`

const Cell = styled.div`
	height: ${CELL_H}px;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 6px;
	font-family: ${theme.fontDisplay};
	font-size: clamp(0.78rem, 2.5vw, 0.92rem);
	font-weight: 700;
	color: ${theme.ink};
	text-align: center;
	line-height: 1.15;
	word-break: keep-all;
`
const SpinButton = styled.button<{ $disabled: boolean }>`
	appearance: none;
	border: 0;
	padding: 12px 32px;
	border-radius: 999px;
	font-family: ${theme.fontDisplay};
	font-size: 1.08rem;
	font-weight: 700;
	cursor: ${p => (p.$disabled ? 'not-allowed' : 'pointer')};
	opacity: ${p => (p.$disabled ? 0.55 : 1)};
	color: #fff;
	background: linear-gradient(135deg, ${theme.accent} 0%, #d94420 100%);
	box-shadow: 0 12px 26px rgba(255, 90, 54, 0.4);
	transition: transform 0.15s ease;

	&:not(:disabled):active {
		transform: scale(0.98);
	}
`

const Result = styled.div<{ $show: boolean }>`
	text-align: center;
	min-height: 64px;
	opacity: ${p => (p.$show ? 1 : 0)};
	transition: opacity 0.35s ease;

	.badge {
		display: inline-block;
		margin-bottom: 6px;
		padding: 4px 10px;
		border-radius: 8px;
		font-size: 0.75rem;
		font-weight: 700;
		color: #fff;
		background: ${theme.accent};
	}

	.name {
		font-family: ${theme.fontDisplay};
		font-size: clamp(1.4rem, 3vw, 1.85rem);
		color: ${theme.accent};
	}
`

const FairNote = styled.p`
	margin: 0;
	text-align: center;
	font-size: 0.8rem;
	font-weight: 500;
	color: ${theme.inkSoft};
	line-height: 1.45;

	strong {
		color: ${theme.teal};
		font-weight: 700;
	}
`

/** 0 .. length-1 균등 정수. `Math.random` 대신 rejection sampling */
const pickUniformIndex = (length: number): number => {
	if (length <= 1) {
		return 0
	}
	const bucket = new Uint32Array(1)
	const max = 0x1_0000_0000
	const limit = max - (max % length)
	const cryptoApi = globalThis.crypto
	if (cryptoApi?.getRandomValues) {
		do {
			cryptoApi.getRandomValues(bucket)
		} while (bucket[0] >= limit)
		return bucket[0] % length
	}
	return Math.floor(Math.random() * length)
}

const pickWinner = (names: string[]) =>
	names[pickUniformIndex(names.length)] ?? ''

const buildStrip = (names: string[], winner: string, extraSpins: number) => {
	const strip: string[] = []
	for (let i = 0; i < extraSpins; i++) {
		strip.push(pickWinner(names))
	}
	strip.push(winner)
	return strip
}

type ReelState = {
	strip: string[]
	offset: number
}

const makeIdleReels = (names: string[]): ReelState[] =>
	[0, 1, 2].map(i => ({
		strip: [names[i % names.length] ?? '—'],
		offset: 0,
	}))

export const CoffeeSlotMachine = ({ names, onResult }: Props) => {
	const [spinning, setSpinning] = useState(false)
	const [jackpot, setJackpot] = useState(false)
	const [winner, setWinner] = useState<string | null>(null)
	const [spinEpoch, setSpinEpoch] = useState(0)
	const [reels, setReels] = useState<ReelState[]>([
		{ strip: ['—'], offset: 0 },
		{ strip: ['—'], offset: 0 },
		{ strip: ['—'], offset: 0 },
	])
	const [sessionWins, setSessionWins] = useState<Record<string, number>>({})
	const endTimerRef = useRef<number | null>(null)

	const n = names.length

	useEffect(() => {
		if (n >= 2) {
			setReels(makeIdleReels(names))
		}
	}, [names, n])

	useEffect(
		() => () => {
			if (endTimerRef.current !== null) {
				window.clearTimeout(endTimerRef.current)
			}
		},
		[],
	)

	const spin = () => {
		if (n < 2 || spinning) {
			return
		}

		if (endTimerRef.current !== null) {
			window.clearTimeout(endTimerRef.current)
		}

		const picked = pickWinner(names)
		setWinner(null)
		setJackpot(false)
		setSpinning(false)

		const extras = [18, 22, 26]
		const nextReels = extras.map(extra => {
			const strip = buildStrip(names, picked, extra)
			return { strip, offset: 0 }
		})
		setReels(nextReels)
		setSpinEpoch(e => e + 1)

		// transition 없이 0에서 시작 → 다음 프레임에 spinning 켜고 목표까지 애니메이션
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				setSpinning(true)
				setReels(
					nextReels.map(r => ({
						...r,
						offset: (r.strip.length - 1) * CELL_H,
					})),
				)
			})
		})

		endTimerRef.current = window.setTimeout(() => {
			setSpinning(false)
			setJackpot(true)
			setWinner(picked)
			setSessionWins(prev => ({
				...prev,
				[picked]: (prev[picked] ?? 0) + 1,
			}))
			onResult?.(picked)
			endTimerRef.current = null
		}, REEL_SPIN_MS[2] + 120)
	}

	const sessionStatsText = names
		.map(name => `${name} ${sessionWins[name] ?? 0}회`)
		.join(' · ')
	const totalSpins = Object.values(sessionWins).reduce((a, b) => a + b, 0)

	if (n < 2) {
		return (
			<StageCentered>
				<EmptyStateCard>
					<EmptyIcon aria-hidden>🎰</EmptyIcon>
					<EmptyMessage>참여자를 2명 이상 넣어 주세요.</EmptyMessage>
					<EmptyFair>
						당첨은 <strong>검증된 1/N 균등 추첨</strong>으로 정해집니다.
						<br />
						브라우저 암호 난수로 참여자마다 같은 확률을 보장해요.
					</EmptyFair>
				</EmptyStateCard>
			</StageCentered>
		)
	}

	return (
		<Stage>
			<Cabinet $jackpot={jackpot && Boolean(winner)}>
				<MarqueeBar>
					<MarqueeTrack $run={spinning || jackpot}>
						<span>☕ COFFEE SLOT ☕ 세 줄 맞추면 담당 확정 ☕</span>
						<span>☕ COFFEE SLOT ☕ 세 줄 맞추면 담당 확정 ☕</span>
					</MarqueeTrack>
				</MarqueeBar>

				<ReelsRow>
					<Payline aria-hidden />
					{reels.map((reel, i) => (
						<ReelWindow key={i}>
							<ReelStrip
								key={`${spinEpoch}-${i}`}
								$offset={reel.offset}
								$duration={REEL_SPIN_MS[i]}
								$spinning={spinning}
							>
								{reel.strip.map((label, idx) => (
									<Cell key={`${i}-${idx}-${label}`}>{label}</Cell>
								))}
							</ReelStrip>
						</ReelWindow>
					))}
				</ReelsRow>
			</Cabinet>

			<SpinButton
				type="button"
				$disabled={spinning}
				disabled={spinning}
				onClick={spin}
			>
				{spinning ? '돌아가는 중…' : winner ? '다시 돌리기' : '슬롯 돌리기'}
			</SpinButton>

			<Result $show={Boolean(winner) && !spinning}>
				{winner ? (
					<>
						<div className="badge">🎰 잭팟</div>
						<div className="name">{winner}</div>
					</>
				) : null}
			</Result>

			<FairNote>
				<strong>검증된 1/N 균등 추첨</strong> — 참여자 {n}명이면 각각 1/{n}
				확률입니다. 릴 연출과 무관하게 매 스핀 새로 뽑습니다.
				{totalSpins > 0 ? (
					<>
						<br />
						이번 목록 통계 · {sessionStatsText}
					</>
				) : null}
			</FairNote>
		</Stage>
	)
}
