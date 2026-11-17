import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import styled, { keyframes } from 'styled-components'
import { theme } from '../../styles/theme'

type Props = {
	active: boolean
	burstKey: number
}

const COLORS = [theme.accent, theme.teal, '#ffd54f', '#fff176', '#ffffff', '#e040fb']

const sparkFly = keyframes`
	0% {
		transform: translate(-50%, -50%) scale(0.35);
		opacity: 1;
	}
	100% {
		transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0.15);
		opacity: 0;
	}
`

const ringPop = keyframes`
	0% {
		transform: translate(-50%, -50%) scale(0.15);
		opacity: 0.85;
	}
	100% {
		transform: translate(-50%, -50%) scale(2.2);
		opacity: 0;
	}
`

const twinkle = keyframes`
	0%,
	100% {
		opacity: 0;
		transform: scale(0.5);
	}
	50% {
		opacity: 1;
		transform: scale(1.2);
	}
`

const Overlay = styled.div`
	position: absolute;
	inset: 0;
	pointer-events: none;
	overflow: hidden;
	z-index: 3;
`

const BurstOrigin = styled.div`
	position: absolute;
	left: 50%;
	top: 38%;
	width: 0;
	height: 0;
`

const Spark = styled.span<{
	$color: string
	$size: number
	$delay: number
	$duration: number
}>`
	position: absolute;
	left: 0;
	top: 0;
	width: ${p => p.$size}px;
	height: ${p => p.$size}px;
	border-radius: 50%;
	background: ${p => p.$color};
	box-shadow: 0 0 10px ${p => p.$color};
	animation: ${sparkFly} ${p => p.$duration}s ease-out ${p => p.$delay}s forwards;
`

const Ring = styled.div<{ $delay: number; $hue: string }>`
	position: absolute;
	left: 0;
	top: 0;
	width: 72px;
	height: 72px;
	margin: -36px 0 0 -36px;
	border-radius: 50%;
	border: 3px solid ${p => p.$hue};
	animation: ${ringPop} 0.85s ease-out ${p => p.$delay}s forwards;
	opacity: 0;
`

const Star = styled.span<{
	$left: string
	$top: string
	$delay: number
}>`
	position: absolute;
	left: ${p => p.$left};
	top: ${p => p.$top};
	font-size: 1.1rem;
	animation: ${twinkle} 0.9s ease-in-out ${p => p.$delay}s 2;
	opacity: 0;
`

const buildParticles = (burstKey: number) => {
	const count = 32
	return Array.from({ length: count }, (_, i) => {
		const rand =
			(((burstKey + 1) * 9301 + (i + 1) * 49297) % 233280) / 233280
		const angle = (i / count) * Math.PI * 2 + rand * 0.6
		const dist = 55 + rand * 95
		return {
			id: i,
			tx: `${Math.cos(angle) * dist}px`,
			ty: `${Math.sin(angle) * dist}px`,
			color: COLORS[i % COLORS.length],
			size: 5 + Math.floor(rand * 5),
			delay: (i % 6) * 0.03,
			duration: 0.75 + rand * 0.55,
		}
	})
}

export const SlotFireworks = ({ active, burstKey }: Props) => {
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		if (!active || burstKey <= 0) {
			setVisible(false)
			return
		}
		setVisible(true)
		const t = window.setTimeout(() => setVisible(false), 2600)
		return () => window.clearTimeout(t)
	}, [active, burstKey])

	const particles = useMemo(() => buildParticles(burstKey), [burstKey])

	if (!visible) {
		return null
	}

	return (
		<Overlay aria-hidden data-fireworks>
			<BurstOrigin>
				<Ring $delay={0} $hue="rgba(255, 90, 54, 0.75)" />
				<Ring $delay={0.12} $hue="rgba(15, 143, 130, 0.65)" />
				<Ring $delay={0.22} $hue="rgba(255, 224, 130, 0.55)" />
				{particles.map(p => (
					<Spark
						key={`${burstKey}-${p.id}`}
						$color={p.color}
						$size={p.size}
						$delay={p.delay}
						$duration={p.duration}
						style={
							{
								['--tx' as string]: p.tx,
								['--ty' as string]: p.ty,
							} as CSSProperties
						}
					/>
				))}
			</BurstOrigin>
			<Star $left="12%" $top="18%" $delay={0.05}>
				✨
			</Star>
			<Star $left="82%" $top="22%" $delay={0.15}>
				🎉
			</Star>
			<Star $left="20%" $top="72%" $delay={0.2}>
				☕
			</Star>
			<Star $left="78%" $top="68%" $delay={0.1}>
				✨
			</Star>
		</Overlay>
	)
}