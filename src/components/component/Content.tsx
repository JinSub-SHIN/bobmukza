import { Divider } from 'antd'
import { Calculating } from './Calculating'
import { CustomCalendar } from './CustomCalendar'
import { Notice } from './Notice'
import styled from 'styled-components'

/** 식대 메인: 둥근 폰트 + 파스텔 톤 */
const CuteShell = styled.div`
	font-family:
		'Jua',
		'Apple SD Gothic Neo',
		'Malgun Gothic',
		sans-serif;
	font-size: 17px;
	letter-spacing: 0.02em;
	-webkit-font-smoothing: antialiased;

	input,
	.ant-input,
	.ant-input-number-input {
		font-family:
			'Apple SD Gothic Neo',
			'Malgun Gothic',
			sans-serif;
		font-size: 16px;
	}
`

const ResponsiveWrapper = styled.div`
	@media (max-width: 1400px) {
		display: none;
	}
`

const MobileWrapper = styled.div`
	display: none;

	@media (max-width: 1400px) {
		display: block;
	}
`

/** 데스크톱: 달력 / 계산 패널 동일 높이·동일 톤 */
const DesktopSplit = styled.div`
	display: flex;
	align-items: stretch;
	gap: 20px;
	max-width: 1680px;
	margin: 0 auto;
	padding: 0 20px 28px;
	box-sizing: border-box;
`

const DesktopPane = styled.div`
	flex: 1 1 0;
	min-width: 0;
	display: flex;
	flex-direction: column;
`

const PaneGlass = styled.div<{ $square?: boolean }>`
	flex: 1;
	display: flex;
	flex-direction: column;
	min-height: min(920px, calc(100vh - 180px));
	padding: 20px 18px 18px;
	box-sizing: border-box;
	border-radius: ${p => (p.$square ? 0 : '28px')};
	background: linear-gradient(
		165deg,
		#fffef9 0%,
		#fff5fb 30%,
		#f3fffb 58%,
		#fff8e7 100%
	);
	border: 4px solid #ffd6e8;
	box-shadow:
		0 8px 0 rgba(255, 192, 220, 0.55),
		0 14px 32px rgba(255, 160, 200, 0.18),
		inset 0 2px 0 rgba(255, 255, 255, 0.9);
	position: relative;
	overflow: hidden;

	&::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		pointer-events: none;
		background: radial-gradient(
			circle at 10% 20%,
			rgba(255, 230, 180, 0.45) 0%,
			transparent 42%
		);
	}

	&::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		pointer-events: none;
		background: radial-gradient(
			circle at 92% 88%,
			rgba(186, 240, 255, 0.4) 0%,
			transparent 40%
		);
	}
`

const PaneInner = styled.div`
	position: relative;
	z-index: 1;
	flex: 1;
	display: flex;
	flex-direction: column;
	min-height: 0;
`

export const Content = () => {
	return (
		<CuteShell>
			<ResponsiveWrapper>
				<Notice />
				<DesktopSplit>
					<DesktopPane>
						<PaneGlass $square>
							<PaneInner>
								<CustomCalendar />
							</PaneInner>
						</PaneGlass>
					</DesktopPane>
					<DesktopPane>
						<PaneGlass>
							<PaneInner>
								<Calculating />
							</PaneInner>
						</PaneGlass>
					</DesktopPane>
				</DesktopSplit>
			</ResponsiveWrapper>
			<MobileWrapper>
				<Notice />
				<CustomCalendar />
				<Divider
					style={{ borderColor: '#7cb305', marginTop: 15, marginBottom: 35 }}
				>
					🍕🍟🌭🍖🍙🍕🍟🌭🍖🍙
				</Divider>
				<Calculating />
			</MobileWrapper>
		</CuteShell>
	)
}
