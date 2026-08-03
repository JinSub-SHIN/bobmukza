import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { RootState } from '../../store'
import { numberWithCommas } from '../hook/useNumberComma'
import { setWorkday } from '../../store/action/workdaySlice'
import { Input, Tooltip } from 'antd'
import { numberRegexp } from '../hook/useNumberRegexp'
import dayjs from 'dayjs'
import { theme } from '../../styles/theme'

const Root = styled.div`
	height: 100%;
	min-height: 0;
	display: flex;
	flex-direction: column;
	gap: 14px;
	font-family: ${theme.fontBody};
	color: ${theme.ink};
`

const InputGrid = styled.div`
	flex-shrink: 0;
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 10px;

	@media (max-width: 700px) {
		grid-template-columns: 1fr;
	}
`

const Field = styled.label`
	display: flex;
	flex-direction: column;
	gap: 6px;
	padding: 12px 14px;
	border-radius: ${theme.radiusSm};
	background: rgba(255, 255, 255, 0.65);
	border: 1px solid ${theme.line};
`

const FieldTop = styled.div`
	display: flex;
	align-items: baseline;
	justify-content: space-between;
	gap: 8px;
`

const FieldName = styled.span`
	font-size: 13px;
	font-weight: 700;
	color: ${theme.ink};
`

const FieldHint = styled.span`
	font-size: 11px;
	font-weight: 500;
	color: ${theme.inkSoft};
`

const Suffix = styled.span`
	font-size: 12px;
	font-weight: 700;
	color: ${theme.inkSoft};
`

const FieldInput = styled.div<{ $tone: 'teal' | 'accent' }>`
	.ant-input-affix-wrapper {
		border-radius: 10px;
		padding: 8px 12px;
		min-height: 42px;
		background: #fff;
		border: 1px solid ${theme.line};
	}

	.ant-input-affix-wrapper-focused,
	.ant-input-affix-wrapper:focus-within {
		border-color: ${p =>
			p.$tone === 'teal' ? theme.teal : theme.accent} !important;
		box-shadow: 0 0 0 3px
			${p =>
				p.$tone === 'teal'
					? 'rgba(15, 143, 130, 0.14)'
					: 'rgba(255, 90, 54, 0.14)'} !important;
	}

	.ant-input {
		font-family: ${theme.fontMono};
		font-size: 16px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		color: ${theme.ink} !important;
	}
`

const Scroll = styled.div`
	flex: 1;
	min-height: 0;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	gap: 12px;
	padding-right: 2px;
`

const Hero = styled.section<{ $ok: boolean }>`
	padding: 18px 18px 16px;
	border-radius: ${theme.radius};
	border: 1px solid ${theme.line};
	background: ${p =>
		p.$ok
			? 'linear-gradient(145deg, rgba(15,143,130,0.14) 0%, rgba(255,255,255,0.85) 55%)'
			: 'linear-gradient(145deg, rgba(255,90,54,0.14) 0%, rgba(255,255,255,0.85) 55%)'};
	box-shadow: ${theme.shadow};
`

const HeroTop = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 10px;
	margin-bottom: 14px;
`

const HeroLabel = styled.p`
	margin: 0;
	font-size: 13px;
	font-weight: 700;
	letter-spacing: 0.04em;
	color: ${theme.inkSoft};
`

const StatusPill = styled.span<{ $ok: boolean }>`
	display: inline-flex;
	align-items: center;
	padding: 5px 10px;
	border-radius: 8px;
	font-size: 12px;
	font-weight: 700;
	color: ${p => (p.$ok ? theme.plus : theme.warn)};
	background: ${p =>
		p.$ok ? 'rgba(26, 122, 76, 0.12)' : 'rgba(196, 92, 26, 0.12)'};
`

const HeroGrid = styled.div`
	display: grid;
	grid-template-columns: 1.15fr 1fr;
	gap: 12px;

	@media (max-width: 560px) {
		grid-template-columns: 1fr;
	}
`

const HeroMetric = styled.div`
	min-width: 0;
`

const HeroCaption = styled.div`
	font-size: 12px;
	font-weight: 600;
	color: ${theme.inkSoft};
	margin-bottom: 4px;
`

const HeroValue = styled.div<{ $tone?: 'accent' | 'ok' | 'warn' }>`
	font-family: ${theme.fontDisplay};
	font-size: clamp(1.7rem, 3vw, 2.25rem);
	line-height: 1.05;
	letter-spacing: -0.03em;
	font-variant-numeric: tabular-nums;
	color: ${p =>
		p.$tone === 'accent'
			? theme.accent
			: p.$tone === 'ok'
				? theme.plus
				: p.$tone === 'warn'
					? theme.warn
					: theme.ink};

	small {
		margin-left: 4px;
		font-family: ${theme.fontBody};
		font-size: 0.9rem;
		font-weight: 700;
		color: ${theme.inkSoft};
		letter-spacing: 0;
	}
`

const HeroSub = styled.p`
	margin: 6px 0 0;
	font-size: 12px;
	line-height: 1.4;
	color: ${theme.inkSoft};
`

const ChipRow = styled.div`
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 8px;

	@media (max-width: 560px) {
		grid-template-columns: 1fr;
	}
`

const Chip = styled.div`
	padding: 12px 12px 10px;
	border-radius: ${theme.radiusSm};
	background: rgba(255, 255, 255, 0.72);
	border: 1px solid ${theme.line};
`

const ChipLabel = styled.div`
	font-size: 11px;
	font-weight: 700;
	color: ${theme.inkSoft};
	margin-bottom: 4px;
`

const ChipValue = styled.div`
	font-family: ${theme.fontMono};
	font-size: 1.05rem;
	font-weight: 700;
	font-variant-numeric: tabular-nums;
	color: ${theme.ink};

	small {
		margin-left: 3px;
		font-family: ${theme.fontBody};
		font-size: 0.75rem;
		font-weight: 700;
		color: ${theme.inkSoft};
	}
`

const Section = styled.section`
	border-radius: ${theme.radiusSm};
	border: 1px solid ${theme.line};
	background: rgba(255, 255, 255, 0.7);
	overflow: hidden;
`

const SectionHead = styled.div`
	padding: 11px 14px;
	font-size: 13px;
	font-weight: 700;
	color: ${theme.ink};
	background: rgba(20, 35, 28, 0.04);
	border-bottom: 1px solid ${theme.line};
`

const SectionBody = styled.div`
	padding: 4px 14px 8px;
`

const RowLine = styled.div`
	display: flex;
	align-items: baseline;
	justify-content: space-between;
	gap: 12px;
	padding: 10px 0;
	border-bottom: 1px solid ${theme.line};

	&:last-child {
		border-bottom: none;
	}
`

const RowLabel = styled.span`
	font-size: 13px;
	font-weight: 500;
	color: ${theme.inkSoft};
	min-width: 0;

	em {
		font-style: normal;
		font-size: 11px;
		margin-left: 6px;
		opacity: 0.85;
	}
`

const RowValue = styled.span<{ $tone?: 'plus' | 'minus' | 'strong' }>`
	font-family: ${theme.fontMono};
	font-size: 14px;
	font-weight: 700;
	font-variant-numeric: tabular-nums;
	text-align: right;
	color: ${p =>
		p.$tone === 'plus'
			? theme.plus
			: p.$tone === 'minus'
				? theme.minus
				: p.$tone === 'strong'
					? theme.ink
					: theme.ink};

	small {
		margin-left: 2px;
		font-family: ${theme.fontBody};
		font-size: 11px;
		font-weight: 700;
		color: ${theme.inkSoft};
	}
`

const Help = styled.span`
	cursor: help;
	border-bottom: 1px dotted ${theme.lineStrong};
`

function won(n: number) {
	return numberWithCommas(Math.round(n))
}

export const Calculating = () => {
	const dispatch = useDispatch()
	const ws = useSelector((state: RootState) => state.workdayStatus)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		localStorage.setItem('userCalendar', (dayjs().month() + 1).toString())
		const copy = { ...ws }
		const { value } = e.target

		if (value.length === 0) {
			copy.usageAmount = undefined
			dispatch(setWorkday(copy))
			return
		}
		if (numberRegexp(value) === false || value.length > 7) return
		copy.usageAmount = Number(value)
		dispatch(setWorkday(copy))
	}

	const handleExceptionInputChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const copy = { ...ws }
		const { value } = e.target

		if (value.length === 0) {
			copy.exceptionMoney = undefined
			dispatch(setWorkday(copy))
			return
		}
		if (numberRegexp(value) === false || value.length > 7) return
		copy.exceptionMoney = Number(value)
		dispatch(setWorkday(copy))
	}

	const totalAmount =
		ws.workday * 13000 -
		ws.allHolidayCount * 13000 -
		ws.morningHoldayCount * 10000 +
		ws.extraMoneyCount * 10000

	const remainingAmount = ws.usageAmount
		? totalAmount - ws.usageAmount + (ws.exceptionMoney ?? 0)
		: totalAmount

	const willPayAmount = ws.specialDayList.reduce(
		(sum, item) => sum + item.amount,
		0,
	)

	const remainingWorkDays = ws.workRemaningDay - ws.afterTodayHolidayCount

	const avgDenom =
		ws.workRemaningDay -
		ws.afterTodayHolidayCount -
		ws.specialDayList.length
	const averageAmountRaw =
		avgDenom === 0 ? remainingAmount : (remainingAmount - willPayAmount) / avgDenom
	const averageAmount = Number.isFinite(averageAmountRaw) ? averageAmountRaw : 0

	const avgHealthy =
		remainingWorkDays === 0 ? remainingAmount >= 0 : averageAmount >= 13000

	const avgDisplay =
		remainingWorkDays === 0
			? won(remainingAmount)
			: averageAmount.toLocaleString('ko-KR', {
					maximumFractionDigits: 0,
					minimumFractionDigits: 0,
				})

	return (
		<Root>
			<InputGrid>
				<Field>
					<FieldTop>
						<FieldName>고위드 이용 금액</FieldName>
						<FieldHint>누적</FieldHint>
					</FieldTop>
					<FieldInput $tone="teal">
						<Input
							allowClear
							inputMode="numeric"
							autoComplete="off"
							placeholder="예: 125000"
							onChange={handleChange}
							value={
								ws.usageAmount === undefined ? '' : String(ws.usageAmount)
							}
							suffix={<Suffix>원</Suffix>}
						/>
					</FieldInput>
				</Field>
				<Field>
					<FieldTop>
						<FieldName>반려 · 오사용</FieldName>
						<FieldHint>있을 때만</FieldHint>
					</FieldTop>
					<FieldInput $tone="accent">
						<Input
							allowClear
							inputMode="numeric"
							autoComplete="off"
							placeholder="없으면 비움"
							onChange={handleExceptionInputChange}
							value={
								ws.exceptionMoney === undefined
									? ''
									: String(ws.exceptionMoney)
							}
							suffix={<Suffix>원</Suffix>}
						/>
					</FieldInput>
				</Field>
			</InputGrid>

			<Scroll>
				<Hero $ok={avgHealthy}>
					<HeroTop>
						<HeroLabel>지금 한눈에</HeroLabel>
						<StatusPill $ok={avgHealthy}>
							{avgHealthy ? '여유 있음' : '조금 빠듯함'}
						</StatusPill>
					</HeroTop>
					<HeroGrid>
						<HeroMetric>
							<HeroCaption>남은 식대</HeroCaption>
							<HeroValue $tone="accent">
								{won(remainingAmount)}
								<small>원</small>
							</HeroValue>
							<HeroSub>
								이번 달 총액 {won(totalAmount)}원
								{ws.usageAmount
									? ` − 사용 ${won(ws.usageAmount)}원`
									: ' · 사용액 미입력'}
							</HeroSub>
						</HeroMetric>
						<HeroMetric>
							<HeroCaption>
								<Tooltip title="(잔액 − 예상 지출) ÷ (남은 근무일 − 예상 지출 등록 일수)">
									<Help>앞으로 하루 평균</Help>
								</Tooltip>
							</HeroCaption>
							<HeroValue $tone={avgHealthy ? 'ok' : 'warn'}>
								{avgDisplay}
								<small>원</small>
							</HeroValue>
							<HeroSub>
								{remainingWorkDays === 0
									? '남은 근무일이 없습니다'
									: `기준 ${13000}원 · ${avgHealthy ? '기준 이상' : '기준 미만'}`}
							</HeroSub>
						</HeroMetric>
					</HeroGrid>
				</Hero>

				<ChipRow>
					<Chip>
						<ChipLabel>
							<Tooltip title="당일 점심 이후에는 그날을 근무일수로 보지 않습니다.">
								<Help>남은 근무일</Help>
							</Tooltip>
						</ChipLabel>
						<ChipValue>
							{remainingWorkDays}
							<small>일</small>
						</ChipValue>
					</Chip>
					<Chip>
						<ChipLabel>예상 지출 등록</ChipLabel>
						<ChipValue>
							{ws.specialDayList.length}
							<small>일</small>
						</ChipValue>
					</Chip>
					<Chip>
						<ChipLabel>예상 지출 금액</ChipLabel>
						<ChipValue>
							{won(willPayAmount)}
							<small>원</small>
						</ChipValue>
					</Chip>
				</ChipRow>

				<Section>
					<SectionHead>이번 달 식대 구성</SectionHead>
					<SectionBody>
						<RowLine>
							<RowLabel>
								기본 제공
								<em>{ws.workday}일 × 13,000</em>
							</RowLabel>
							<RowValue $tone="strong">
								{won(ws.workday * 13000)}
								<small>원</small>
							</RowValue>
						</RowLine>
						<RowLine>
							<RowLabel>
								휴가 차감
								<em>{ws.allHolidayCount}일</em>
							</RowLabel>
							<RowValue $tone={ws.allHolidayCount ? 'minus' : undefined}>
								{ws.allHolidayCount
									? `−${won(ws.allHolidayCount * 13000)}`
									: '0'}
								<small>원</small>
							</RowValue>
						</RowLine>
						<RowLine>
							<RowLabel>
								오전반차 차감
								<em>{ws.morningHoldayCount}일</em>
							</RowLabel>
							<RowValue $tone={ws.morningHoldayCount ? 'minus' : undefined}>
								{ws.morningHoldayCount
									? `−${won(ws.morningHoldayCount * 10000)}`
									: '0'}
								<small>원</small>
							</RowValue>
						</RowLine>
						<RowLine>
							<RowLabel>
								야근 추가
								<em>{ws.extraMoneyCount}회</em>
							</RowLabel>
							<RowValue $tone={ws.extraMoneyCount ? 'plus' : undefined}>
								{ws.extraMoneyCount
									? `+${won(ws.extraMoneyCount * 10000)}`
									: '0'}
								<small>원</small>
							</RowValue>
						</RowLine>
						<RowLine>
							<RowLabel>
								<Tooltip title="오사용으로 다음 달에 입금해야 하면, 잔액에 더해져 계산됩니다.">
									<Help>반려 · 오사용 반영</Help>
								</Tooltip>
							</RowLabel>
							<RowValue $tone={(ws.exceptionMoney ?? 0) ? 'plus' : undefined}>
								{(ws.exceptionMoney ?? 0)
									? `+${won(ws.exceptionMoney ?? 0)}`
									: '0'}
								<small>원</small>
							</RowValue>
						</RowLine>
					</SectionBody>
				</Section>
			</Scroll>
		</Root>
	)
}
