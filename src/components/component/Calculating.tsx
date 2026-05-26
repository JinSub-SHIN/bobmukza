import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { RootState } from '../../store'
import { numberWithCommas } from '../hook/useNumberComma'
import { setWorkday } from '../../store/action/workdaySlice'
import { Card, Col, Input, Row, Tooltip } from 'antd'
import { numberRegexp } from '../hook/useNumberRegexp'
import dayjs from 'dayjs'
import {
	BarChartOutlined,
	CalculatorOutlined,
	CalendarOutlined,
	WalletOutlined,
	WarningOutlined,
} from '@ant-design/icons'
import type { ReactNode } from 'react'

/* 쌍팔년도 신문/한컴 팔레트 — CustomCalendar.tsx와 동일 */
const RETRO_PAPER = '#efe2bd'
const RETRO_PAPER_LIGHT = '#f7ecca'
const RETRO_INK = '#1d150b'
const RETRO_FRAME = '#2b1e10'
const RETRO_RED = '#a3231c'
const RETRO_YELLOW = '#e6b736'
const RETRO_GREEN = '#3a5c1f'
const RETRO_BLUE = '#274a72'
const RETRO_MUTED = '#7a6a4f'

const RETRO_SERIF = `'Batang', '바탕', 'Nanum Myeongjo', 'Noto Serif KR', 'Times New Roman', serif`
const RETRO_MONO = `'GulimChe', '굴림체', 'D2Coding', 'Courier New', monospace`

const CalculatingRoot = styled.div`
	height: 100%;
	min-height: 0;
	display: flex;
	flex-direction: column;
	font-family: ${RETRO_SERIF};
	color: ${RETRO_INK};
`

const InputStack = styled.div`
	flex-shrink: 0;
	display: flex;
	flex-direction: column;
	gap: 18px;
	padding-bottom: 6px;
`

const FieldBlock = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`

const FieldLabelRow = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;

	.anticon {
		color: ${RETRO_RED} !important;
	}
`

const FieldLabel = styled.span`
	font-family: ${RETRO_SERIF};
	font-size: 16px;
	font-weight: 700;
	letter-spacing: 0.12em;
	color: ${RETRO_INK};
`

const FieldHint = styled.span`
	font-family: ${RETRO_SERIF};
	font-size: 14px;
	line-height: 1.45;
	color: ${RETRO_MUTED};
	padding-left: 2px;
`

const SuffixWon = styled.span`
	font-family: ${RETRO_SERIF};
	font-size: 14px;
	font-weight: 700;
	color: ${RETRO_INK};
	font-variant-numeric: tabular-nums;
	user-select: none;
`

const AmountFieldShell = styled.div<{ $accent: 'primary' | 'warning' }>`
	.ant-input-affix-wrapper {
		border-radius: 0;
		padding: 12px 16px;
		min-height: 54px;
		background: ${p =>
			p.$accent === 'primary' ? RETRO_PAPER_LIGHT : RETRO_PAPER};
		border-width: 3px;
		border-style: solid;
		border-color: ${RETRO_FRAME};
		box-shadow: 4px 4px 0 ${RETRO_INK};
		transition:
			background-color 0.15s ease,
			box-shadow 0.15s ease,
			transform 0.1s ease;
	}

	.ant-input-affix-wrapper:hover {
		background: ${p =>
			p.$accent === 'primary' ? '#fff3d1' : RETRO_PAPER_LIGHT};
	}

	.ant-input-affix-wrapper-focused,
	.ant-input-affix-wrapper:focus-within {
		border-color: ${RETRO_RED} !important;
		box-shadow:
			4px 4px 0 ${RETRO_INK},
			inset 0 0 0 2px ${RETRO_RED} !important;
	}

	.ant-input {
		font-family: ${RETRO_MONO};
		font-size: 18px;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		letter-spacing: 0;
		background: transparent !important;
		color: ${RETRO_INK} !important;
	}

	.ant-input::placeholder {
		font-family: ${RETRO_SERIF};
		font-size: 15px !important;
		font-weight: 400 !important;
		color: ${RETRO_MUTED} !important;
	}
`

const ScrollCardsArea = styled.div`
	flex: 1;
	min-height: 0;
	overflow-y: auto;
	margin-top: 8px;
	padding-right: 4px;
`

const InfoPaneCard = styled(Card)<{ $tint?: 'base' | 'calc' | 'extra' }>`
	margin-bottom: 16px;
	border-radius: 0 !important;
	overflow: hidden;
	border: 3px solid ${RETRO_FRAME} !important;
	background: ${RETRO_PAPER} !important;
	box-shadow: 6px 6px 0 ${RETRO_INK};
	font-family: ${RETRO_SERIF};

	.ant-card-head {
		min-height: 52px;
		padding: 0 16px;
		background: ${RETRO_FRAME} !important;
		border-bottom: 3px solid ${RETRO_FRAME} !important;
		color: ${RETRO_PAPER} !important;
	}

	.ant-card-head-title {
		padding: 12px 0;
	}

	.ant-card-body {
		padding: 10px 16px 14px;
		background: ${({ $tint = 'base' }) =>
			$tint === 'calc'
				? `repeating-linear-gradient(0deg, ${RETRO_PAPER_LIGHT} 0, ${RETRO_PAPER_LIGHT} 24px, rgba(43,30,16,0.05) 24px, rgba(43,30,16,0.05) 25px)`
				: $tint === 'extra'
					? `repeating-linear-gradient(0deg, #f5e9c4 0, #f5e9c4 24px, rgba(43,30,16,0.05) 24px, rgba(43,30,16,0.05) 25px)`
					: `repeating-linear-gradient(0deg, ${RETRO_PAPER} 0, ${RETRO_PAPER} 24px, rgba(43,30,16,0.05) 24px, rgba(43,30,16,0.05) 25px)`};
	}

	&:last-child {
		margin-bottom: 0;
	}
`

const CardTitleInner = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
`

const TitleIcon = styled.span<{ $from: string; $to: string }>`
	width: 38px;
	height: 38px;
	border-radius: 0;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	font-size: 18px;
	color: ${RETRO_INK};
	background: ${RETRO_YELLOW};
	border: 2px solid ${RETRO_PAPER};
	box-shadow: 3px 3px 0 ${RETRO_INK};

	.anticon {
		color: ${RETRO_INK} !important;
	}
`

const TitleText = styled.span<{ $from: string; $to: string }>`
	font-family: ${RETRO_SERIF};
	font-size: 17px;
	font-weight: 700;
	letter-spacing: 0.2em;
	color: ${RETRO_PAPER};
	text-shadow: 2px 2px 0 ${RETRO_RED};
	-webkit-text-fill-color: ${RETRO_PAPER};
`

const StatRow = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	gap: 14px;
	padding: 10px 0;
	border-bottom: 1px dashed ${RETRO_FRAME};

	&:last-child {
		border-bottom: none;
		padding-bottom: 2px;
	}
`

const StatLabel = styled.span`
	font-family: ${RETRO_SERIF};
	font-size: 15px;
	color: ${RETRO_INK};
	line-height: 1.45;
	flex: 1;
	min-width: 0;
	font-weight: 400;
	letter-spacing: 0.04em;
`

const StatLabelHelp = styled.span`
	cursor: help;
	border-bottom: 1px dotted ${RETRO_FRAME};
`

const StatRight = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-end;
	align-items: baseline;
	gap: 2px 6px;
	text-align: right;
	max-width: 58%;
`

const StatValue = styled.span<{ $tone?: 'default' | 'emphasis' | 'plus' | 'minus' | 'warn' }>`
	font-family: ${RETRO_MONO};
	font-size: 16px;
	font-weight: 700;
	font-variant-numeric: tabular-nums;
	letter-spacing: 0;
	color: ${p =>
		p.$tone === 'emphasis'
			? RETRO_RED
			: p.$tone === 'plus'
				? RETRO_GREEN
				: p.$tone === 'minus'
					? RETRO_RED
					: p.$tone === 'warn'
						? RETRO_BLUE
						: RETRO_INK};
`

const StatUnit = styled.span`
	font-family: ${RETRO_SERIF};
	font-size: 13px;
	font-weight: 700;
	color: ${RETRO_MUTED};
	margin-left: 2px;
`

const StatMeta = styled.span`
	font-family: ${RETRO_MONO};
	font-size: 13px;
	font-weight: 400;
	color: ${RETRO_MUTED};
	font-variant-numeric: tabular-nums;
`

const tooltipProps = {
	color: 'rgba(0, 0, 0, 0.88)' as const,
	overlayInnerStyle: { maxWidth: 300 },
}

function CardHead({
	icon,
	title,
	from,
	to,
	textFrom,
	textTo,
}: {
	icon: ReactNode
	title: string
	from: string
	to: string
	textFrom: string
	textTo: string
}) {
	return (
		<CardTitleInner>
			<TitleIcon $from={from} $to={to}>{icon}</TitleIcon>
			<TitleText $from={textFrom} $to={textTo}>
				{title}
			</TitleText>
		</CardTitleInner>
	)
}

function StatLine({
	label,
	labelTooltip,
	value,
	tone = 'default',
	meta,
}: {
	label: ReactNode
	labelTooltip?: ReactNode
	value: ReactNode
	tone?: 'default' | 'emphasis' | 'plus' | 'minus' | 'warn'
	meta?: ReactNode
}) {
	const lab = labelTooltip ? (
		<Tooltip title={labelTooltip} {...tooltipProps}>
			<StatLabelHelp>{label}</StatLabelHelp>
		</Tooltip>
	) : (
		label
	)

	return (
		<StatRow>
			<StatLabel>{lab}</StatLabel>
			<StatRight>
				<StatValue $tone={tone}>{value}</StatValue>
				{meta != null ? <StatMeta>{meta}</StatMeta> : null}
			</StatRight>
		</StatRow>
	)
}

function amountFrag(n: number, unit = '원') {
	return (
		<>
			{numberWithCommas(n)}
			<StatUnit>{unit}</StatUnit>
		</>
	)
}

function BasicInfoBody({ ws }: { ws: RootState['workdayStatus'] }) {
	return (
		<>
			<StatLine
				label="기본 제공 식대"
				value={amountFrag(ws.workday * 13000)}
				meta={`· ${ws.workday}일`}
			/>
			<StatLine
				label="휴가 차감"
				value={
					ws.allHolidayCount === 0 ? (
						amountFrag(0)
					) : (
						<>
							−{numberWithCommas(ws.allHolidayCount * 13000)}
							<StatUnit>원</StatUnit>
						</>
					)
				}
				tone={ws.allHolidayCount === 0 ? 'default' : 'minus'}
				meta={ws.allHolidayCount === 0 ? '· 0일' : `· ${ws.allHolidayCount}일`}
			/>
			<StatLine
				label="오전반차 차감"
				value={
					ws.morningHoldayCount === 0 ? (
						amountFrag(0)
					) : (
						<>
							−{numberWithCommas(ws.morningHoldayCount * 10000)}
							<StatUnit>원</StatUnit>
						</>
					)
				}
				tone={ws.morningHoldayCount === 0 ? 'default' : 'minus'}
				meta={ws.morningHoldayCount === 0 ? '· 0일' : `· ${ws.morningHoldayCount}일`}
			/>
			<StatLine
				label="야근 추가 식대"
				value={
					ws.extraMoneyCount === 0 ? (
						amountFrag(0)
					) : (
						<>
							+{numberWithCommas(ws.extraMoneyCount * 10000)}
							<StatUnit>원</StatUnit>
						</>
					)
				}
				tone={ws.extraMoneyCount === 0 ? 'default' : 'plus'}
				meta={ws.extraMoneyCount === 0 ? '· 0회' : `· ${ws.extraMoneyCount}회`}
			/>
		</>
	)
}

function CalcInfoBody({
	ws,
	remainingAmount,
}: {
	ws: RootState['workdayStatus']
	remainingAmount: number
}) {
	return (
		<>
			<StatLine
				label="현재 이용 금액"
				value={amountFrag(ws.usageAmount ? ws.usageAmount : 0)}
			/>
			<StatLine
				label="반려 · 오사용"
				labelTooltip="오사용으로 다음 달에 입금해야 하면, 잔액에 그만큼 더해져 계산됩니다."
				value={amountFrag(ws.exceptionMoney ?? 0)}
			/>
			<StatLine
				label="잔액"
				value={amountFrag(remainingAmount)}
				tone="emphasis"
			/>
		</>
	)
}

function EtcInfoBody({
	ws,
	remainingAmount,
	remainingWorkDays,
	willPayAmount,
	averageAmount,
}: {
	ws: RootState['workdayStatus']
	remainingAmount: number
	remainingWorkDays: number
	willPayAmount: number
	averageAmount: string
}) {
	const avgNum = Number(averageAmount)
	const avgHealthy =
		remainingWorkDays === 0 ? remainingAmount >= 0 : avgNum >= 13000

	const avgValue =
		remainingWorkDays === 0 ? (
			amountFrag(remainingAmount)
		) : (
			<>
				{avgNum.toLocaleString('ko-KR', {
					maximumFractionDigits: 1,
					minimumFractionDigits: 0,
				})}
				<StatUnit>원</StatUnit>
			</>
		)

	return (
		<>
			<StatLine
				label="남은 근무 일수"
				labelTooltip="당일 점심 이후에는 그날을 근무일수로 보지 않습니다."
				value={
					<>
						{remainingWorkDays}
						<StatUnit>일</StatUnit>
					</>
				}
			/>
			<StatLine
				label="예상 지출 등록"
				value={
					<>
						{ws.specialDayList.length}
						<StatUnit>일</StatUnit>
					</>
				}
			/>
			<StatLine label="예상 지출 금액" value={amountFrag(willPayAmount)} />
			<StatLine
				label="남은 평균 금액"
				labelTooltip="(잔액 − 예상 지출) ÷ (남은 근무 일수 − 예상 지출 등록 일수)"
				value={avgValue}
				tone={avgHealthy ? 'plus' : 'warn'}
			/>
		</>
	)
}

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

export const Calculating = () => {
	const dispatch = useDispatch()

	const workdayStatus = useSelector((state: RootState) => state.workdayStatus)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		localStorage.setItem('userCalendar', (dayjs().month() + 1).toString())

		const copy = { ...workdayStatus }
		const { value } = e.target

		if (value.length === 0) {
			copy.usageAmount = undefined
			dispatch(setWorkday(copy))
		}
		if (numberRegexp(value) === false) {
			return
		} else {
			if (value.length > 7) {
				return
			}
			copy.usageAmount = Number(value)
			dispatch(setWorkday(copy))
		}
	}

	const handleExceptionInputChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const copy = { ...workdayStatus }
		const { value } = e.target

		if (value.length === 0) {
			copy.exceptionMoney = undefined
			dispatch(setWorkday(copy))
		}
		if (numberRegexp(value) === false) {
			return
		} else {
			if (value.length > 7) {
				return
			}
			copy.exceptionMoney = Number(value)
			dispatch(setWorkday(copy))
		}
	}

	const totalAmount =
		workdayStatus.workday * 13000 -
		workdayStatus.allHolidayCount * 13000 -
		workdayStatus.morningHoldayCount * 10000 +
		workdayStatus.extraMoneyCount * 10000

	const remainingAmount = workdayStatus.usageAmount
		? totalAmount -
			workdayStatus.usageAmount +
			(workdayStatus.exceptionMoney ?? 0)
		: totalAmount

	const willPayAmount = workdayStatus.specialDayList.reduce(
		(sum, item) => sum + item.amount,
		0,
	)

	const avgDenom =
		workdayStatus.workRemaningDay -
		workdayStatus.afterTodayHolidayCount -
		workdayStatus.specialDayList.length
	const averageAmountRaw =
		avgDenom === 0 ? 0 : (remainingAmount - willPayAmount) / avgDenom
	const averageAmount = Number.isFinite(averageAmountRaw)
		? averageAmountRaw.toFixed(1)
		: '0'

	const remainingWorkDays =
		workdayStatus.workRemaningDay - workdayStatus.afterTodayHolidayCount

	return (
		<CalculatingRoot>
			<InputStack>
				<FieldBlock>
					<div>
						<FieldLabelRow>
							<WalletOutlined
								style={{ color: '#e88ec9', fontSize: 20 }}
								aria-hidden
							/>
							<FieldLabel>고위드 이용 금액</FieldLabel>
						</FieldLabelRow>
						<FieldHint>
							앱에서 확인한 이번 달 누적 이용 금액을 숫자만 입력하세요.
						</FieldHint>
					</div>
					<AmountFieldShell $accent="primary">
						<Input
							allowClear
							inputMode="numeric"
							autoComplete="off"
							placeholder="예: 125000"
							onChange={handleChange}
							value={
								workdayStatus.usageAmount === undefined
									? ''
									: String(workdayStatus.usageAmount)
							}
							suffix={<SuffixWon>원</SuffixWon>}
						/>
					</AmountFieldShell>
				</FieldBlock>
				<FieldBlock>
					<div>
						<FieldLabelRow>
							<WarningOutlined
								style={{ color: '#ffb347', fontSize: 20 }}
								aria-hidden
							/>
							<FieldLabel>반려 · 오사용 금액</FieldLabel>
						</FieldLabelRow>
						<FieldHint>해당할 때만 입력합니다. 없으면 비워 두세요.</FieldHint>
					</div>
					<AmountFieldShell $accent="warning">
						<Input
							allowClear
							inputMode="numeric"
							autoComplete="off"
							placeholder="없으면 비움"
							onChange={handleExceptionInputChange}
							value={
								workdayStatus.exceptionMoney === undefined
									? ''
									: String(workdayStatus.exceptionMoney)
							}
							suffix={<SuffixWon>원</SuffixWon>}
						/>
					</AmountFieldShell>
				</FieldBlock>
			</InputStack>
			<ScrollCardsArea>
				<ResponsiveWrapper>
					<InfoPaneCard
						$tint="base"
						hoverable
						variant="borderless"
						title={
							<CardHead
								icon={<CalendarOutlined />}
								title="기본 정보"
								from="#722ed1"
								to="#9254de"
								textFrom="#b565c8"
								textTo="#f0a8e0"
							/>
						}
					>
						<BasicInfoBody ws={workdayStatus} />
					</InfoPaneCard>
					<InfoPaneCard
						$tint="calc"
						hoverable
						variant="borderless"
						title={
							<CardHead
								icon={<CalculatorOutlined />}
								title="계산 정보"
								from="#08979c"
								to="#13c2c2"
								textFrom="#3dad9a"
								textTo="#7fe8d8"
							/>
						}
					>
						<CalcInfoBody
							ws={workdayStatus}
							remainingAmount={remainingAmount}
						/>
					</InfoPaneCard>
					<InfoPaneCard
						$tint="extra"
						hoverable
						variant="borderless"
						title={
							<CardHead
								icon={<BarChartOutlined />}
								title="기타 정보"
								from="#d46b08"
								to="#fa8c16"
								textFrom="#e89860"
								textTo="#ffd08a"
							/>
						}
					>
						<EtcInfoBody
							ws={workdayStatus}
							remainingAmount={remainingAmount}
							remainingWorkDays={remainingWorkDays}
							willPayAmount={willPayAmount}
							averageAmount={averageAmount}
						/>
					</InfoPaneCard>
				</ResponsiveWrapper>
				<MobileWrapper>
					<Row gutter={[16, 16]}>
						<Col xs={24} lg={8}>
							<InfoPaneCard
								$tint="base"
								hoverable
								variant="borderless"
								title={
									<CardHead
										icon={<CalendarOutlined />}
										title="기본 정보"
										from="#722ed1"
										to="#9254de"
										textFrom="#b565c8"
										textTo="#f0a8e0"
									/>
								}
							>
								<BasicInfoBody ws={workdayStatus} />
							</InfoPaneCard>
						</Col>
						<Col xs={24} lg={8}>
							<InfoPaneCard
								$tint="calc"
								hoverable
								variant="borderless"
								title={
									<CardHead
										icon={<CalculatorOutlined />}
										title="계산 정보"
										from="#08979c"
										to="#13c2c2"
										textFrom="#3dad9a"
										textTo="#7fe8d8"
									/>
								}
							>
								<CalcInfoBody
									ws={workdayStatus}
									remainingAmount={remainingAmount}
								/>
							</InfoPaneCard>
						</Col>
						<Col xs={24} lg={8}>
							<InfoPaneCard
								$tint="extra"
								hoverable
								variant="borderless"
								title={
									<CardHead
										icon={<BarChartOutlined />}
										title="기타 정보"
										from="#d46b08"
										to="#fa8c16"
										textFrom="#e89860"
										textTo="#ffd08a"
									/>
								}
							>
								<EtcInfoBody
									ws={workdayStatus}
									remainingAmount={remainingAmount}
									remainingWorkDays={remainingWorkDays}
									willPayAmount={willPayAmount}
									averageAmount={averageAmount}
								/>
							</InfoPaneCard>
						</Col>
					</Row>
				</MobileWrapper>
			</ScrollCardsArea>
		</CalculatingRoot>
	)
}
