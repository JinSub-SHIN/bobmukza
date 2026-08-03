import { Calculating } from './Calculating'
import { CustomCalendar } from './CustomCalendar'
import { Notice } from './Notice'
import styled from 'styled-components'
import { theme } from '../../styles/theme'

const Shell = styled.div`
	font-family: ${theme.fontBody};
	color: ${theme.ink};
	animation: bm-rise 0.65s ease 0.05s both;
`

/** 인트로·달력·계산 패널이 같은 가로폭을 쓰도록 한 컬럼 */
const PageColumn = styled.div`
	width: 100%;
	max-width: 1680px;
	margin: 0 auto;
	padding: 0 20px 12px;
	box-sizing: border-box;

	@media (max-width: 900px) {
		padding: 0 14px 12px;
	}
`

const PageIntro = styled.div`
	width: 100%;
	margin: 0 0 18px;
	padding: 16px 20px;
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
	gap: 16px;
	box-sizing: border-box;
	border-radius: ${theme.radius};
	background: rgba(255, 255, 255, 0.88);
	border: 1px solid ${theme.line};
	box-shadow: 0 10px 28px rgba(20, 35, 28, 0.06);
	backdrop-filter: blur(10px);

	@media (max-width: 900px) {
		flex-direction: column;
		align-items: stretch;
		padding: 14px;
	}
`

const IntroCopy = styled.div`
	h2 {
		margin: 0 0 6px;
		font-family: ${theme.fontDisplay};
		font-size: clamp(1.6rem, 3vw, 2.1rem);
		letter-spacing: -0.02em;
		color: #0d1713;
		line-height: 1.15;
		text-shadow: 0 1px 0 rgba(255, 255, 255, 0.6);
	}

	p {
		margin: 0;
		color: #2f433a;
		font-size: 0.98rem;
		font-weight: 500;
		line-height: 1.55;
		max-width: 36rem;
	}
`

const Desktop = styled.div`
	width: 100%;

	@media (max-width: 1400px) {
		display: none;
	}
`

const Mobile = styled.div`
	display: none;
	width: 100%;

	@media (max-width: 1400px) {
		display: block;
	}
`

const Split = styled.div`
	display: flex;
	align-items: stretch;
	gap: 22px;
	width: 100%;
	box-sizing: border-box;
`

const Pane = styled.div`
	flex: 1 1 0;
	min-width: 0;
	display: flex;
	flex-direction: column;
`

const Surface = styled.div`
	flex: 1;
	width: 100%;
	display: flex;
	flex-direction: column;
	min-height: min(920px, calc(100vh - 200px));
	padding: 22px 20px 18px;
	box-sizing: border-box;
	border-radius: ${theme.radius};
	background: linear-gradient(
		160deg,
		rgba(255, 255, 255, 0.88) 0%,
		rgba(243, 247, 245, 0.92) 100%
	);
	border: 1px solid ${theme.line};
	box-shadow: ${theme.shadow};
	backdrop-filter: blur(10px);
	position: relative;
	overflow: hidden;
	transition: box-shadow 0.25s ease;

	&:hover {
		box-shadow: ${theme.shadowHover};
	}

	&::before {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			radial-gradient(circle at 12% 8%, rgba(15, 143, 130, 0.1) 0%, transparent 38%),
			radial-gradient(circle at 92% 90%, rgba(255, 90, 54, 0.08) 0%, transparent 36%);
	}
`

const SurfaceInner = styled.div`
	position: relative;
	z-index: 1;
	flex: 1;
	display: flex;
	flex-direction: column;
	min-height: 0;
`

const MobileSurface = styled(Surface)`
	min-height: 0;
	margin-bottom: 18px;
	padding: 18px 14px;
`

const MobileDivider = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
	margin: 8px 0 22px;
	color: ${theme.inkSoft};
	font-size: 0.85rem;
	font-weight: 600;
	letter-spacing: 0.08em;

	&::before,
	&::after {
		content: '';
		flex: 1;
		height: 1px;
		background: linear-gradient(
			90deg,
			transparent,
			${theme.lineStrong},
			transparent
		);
	}
`

export const Content = () => {
	return (
		<Shell>
			<PageColumn>
				<PageIntro>
					<IntroCopy>
						<h2>이번 달, 얼마까지 먹을까</h2>
						<p>
							달력에 휴가·야근·예상 지출을 찍고, 고위드 이용 금액을 넣으면 남은
							평균 식대가 바로 나옵니다.
						</p>
					</IntroCopy>
					<Notice />
				</PageIntro>

				<Desktop>
					<Split>
						<Pane>
							<Surface>
								<SurfaceInner>
									<CustomCalendar />
								</SurfaceInner>
							</Surface>
						</Pane>
						<Pane>
							<Surface>
								<SurfaceInner>
									<Calculating />
								</SurfaceInner>
							</Surface>
						</Pane>
					</Split>
				</Desktop>

				<Mobile>
					<MobileSurface>
						<SurfaceInner>
							<CustomCalendar />
						</SurfaceInner>
					</MobileSurface>
					<MobileDivider>계산</MobileDivider>
					<MobileSurface>
						<SurfaceInner>
							<Calculating />
						</SurfaceInner>
					</MobileSurface>
				</Mobile>
			</PageColumn>
		</Shell>
	)
}
