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

const CalculatingRoot = styled.div`
	height: 100%;
	min-height: 0;
	display: flex;
	flex-direction: column;
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
`

const FieldLabel = styled.span`
	font-size: 16px;
	font-weight: 400;
	letter-spacing: 0.02em;
	color: #8b6bb0;
`

const FieldHint = styled.span`
	font-size: 14px;
	line-height: 1.45;
	color: #a898c0;
	padding-left: 2px;
`

const SuffixWon = styled.span`
	font-size: 14px;
	font-weight: 700;
	color: rgba(0, 0, 0, 0.38);
	font-variant-numeric: tabular-nums;
	user-select: none;
`

const AmountFieldShell = styled.div<{ $accent: 'primary' | 'warning' }>`
	.ant-input-affix-wrapper {
		border-radius: 22px;
		padding: 12px 16px;
		min-height: 54px;
		background: ${p =>
			p.$accent === 'primary'
				? `linear-gradient(180deg, #fffafd 0%, #ffeef8 100%)`
				: `linear-gradient(180deg, #fffef8 0%, #fff4e0 100%)`};
		border-width: 3px;
		border-style: solid;
		border-color: ${p =>
			p.$accent === 'primary' ? '#ffc8e8' : '#ffd4a8'};
		box-shadow:
			0 4px 0 ${p => (p.$accent === 'primary' ? '#f5b8e0' : '#f5d0a0')},
			0 6px 14px rgba(255, 180, 210, 0.2);
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease,
			transform 0.1s ease;
	}

	.ant-input-affix-wrapper:hover {
		border-color: ${p => (p.$accent === 'primary' ? '#ff9ecf' : '#ffc078')};
	}

	.ant-input-affix-wrapper-focused,
	.ant-input-affix-wrapper:focus-within {
		border-color: ${p => (p.$accent === 'primary' ? '#ff7eb9' : '#ffb347')} !important;
		box-shadow:
			0 0 0 4px
				${p =>
					p.$accent === 'primary'
						? 'rgba(255, 160, 210, 0.35)'
						: 'rgba(255, 200, 120, 0.4)'},
			0 4px 0 ${p => (p.$accent === 'primary' ? '#f5b8e0' : '#f5d0a0')} !important;
	}

	.ant-input {
		font-size: 18px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		letter-spacing: -0.02em;
		background: transparent !important;
		color: #7b6899 !important;
	}

	.ant-input::placeholder {
		font-size: 15px !important;
		font-weight: 400 !important;
		color: #c4b8d4 !important;
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
	margin-bottom: 14px;
	border-radius: 22px;
	overflow: hidden;
	border: 3px solid #f0e0ff;
	background: rgba(255, 255, 255, 0.75);
	box-shadow:
		0 5px 0 rgba(230, 210, 255, 0.55),
		0 10px 20px rgba(220, 190, 255, 0.15);

	.ant-card-head {
		min-height: 52px;
		padding: 0 16px;
		background: ${({ $tint = 'base' }) =>
			$tint === 'calc'
				? `linear-gradient(95deg, #d4fff5 0%, #e8fffd 50%, #fff 100%)`
				: $tint === 'extra'
					? `linear-gradient(95deg, #fff3d6 0%, #fff8e8 50%, #fff 100%)`
					: `linear-gradient(95deg, #ffe4f3 0%, #f5e8ff 50%, #fff 100%)`};
		border-bottom: 3px dashed #f5e6ff;
	}

	.ant-card-head-title {
		padding: 12px 0;
	}

	.ant-card-body {
		padding: 8px 16px 16px;
		background: ${({ $tint = 'base' }) =>
			$tint === 'calc'
				? `linear-gradient(180deg, #f5fffc 0%, #ffffff 100%)`
				: $tint === 'extra'
					? `linear-gradient(180deg, #fffbf5 0%, #ffffff 100%)`
					: `linear-gradient(180deg, #fff8fd 0%, #ffffff 100%)`};
	}

	&:last-child {
		margin-bottom: 0;
	}
`

const CardTitleInner = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
`

const TitleIcon = styled.span<{ $from: string; $to: string }>`
	width: 40px;
	height: 40px;
	border-radius: 50%;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	font-size: 18px;
	color: #fff;
	background: linear-gradient(145deg, ${p => p.$from} 0%, ${p => p.$to} 100%);
	border: 3px solid #fff;
	box-shadow:
		0 3px 0 rgba(0, 0, 0, 0.08),
		0 6px 12px rgba(0, 0, 0, 0.1);
`

const TitleText = styled.span<{ $from: string; $to: string }>`
	font-size: 17px;
	font-weight: 400;
	letter-spacing: 0.02em;
	background: linear-gradient(98deg, ${p => p.$from} 0%, ${p => p.$to} 100%);
	-webkit-background-clip: text;
	background-clip: text;
	-webkit-text-fill-color: transparent;

	@supports not (background-clip: text) {
		background: none;
		-webkit-text-fill-color: unset;
		color: ${p => p.$from};
	}
`

const StatRow = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	gap: 14px;
	padding: 10px 0;
	border-bottom: 2px dotted #f0e4f8;

	&:last-child {
		border-bottom: none;
		padding-bottom: 2px;
	}
`

const StatLabel = styled.span`
	font-size: 15px;
	color: #9b8ab5;
	line-height: 1.45;
	flex: 1;
	min-width: 0;
	font-weight: 400;
`

const StatLabelHelp = styled.span`
	cursor: help;
	border-bottom: 2px dotted #d4c4e8;
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
	font-size: 16px;
	font-weight: 400;
	font-variant-numeric: tabular-nums;
	letter-spacing: -0.02em;
	color: ${p =>
		p.$tone === 'emphasis'
			? '#2db5a8'
			: p.$tone === 'plus'
				? '#52c41a'
				: p.$tone === 'minus'
					? '#ff6b9d'
					: p.$tone === 'warn'
						? '#ffa940'
						: '#7b6899'};
`

const StatUnit = styled.span`
	font-size: 13px;
	font-weight: 400;
	color: #b8a8d0;
	margin-left: 1px;
`

const StatMeta = styled.span`
	font-size: 13px;
	font-weight: 400;
	color: #c4b4d8;
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
