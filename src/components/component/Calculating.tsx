import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { RootState } from '../../store'
import { numberWithCommas } from '../hook/useNumberComma'
import { setWorkday } from '../../store/action/workdaySlice'
import { Card, Col, Input, Row, Tooltip } from 'antd'
import { numberRegexp } from '../hook/useNumberRegexp'

const CalculatingWrapper = styled.div`
	padding: 5px;
	font-size: 16px;
	font-weight: 400;
`

const StyledInput = styled(Input)`
	height: 60px;

	& ::placeholder {
		color: black !important;
		font-size: 20px !important;
	}

	&.ant-input {
		&::placeholder {
			color: purple; /* 원하는 색상 */
		}
	}

	margin-top: 45px;
	opacity: 1;
`

const StyledCard = styled(Card)`
	min-height: 400px;
`

const CalculatingContent = styled.div`
	margin-top: 6px;
`

const CardTitleHeader = styled.div`
	line-height: 100px;
`

const GirdCard = styled(Card)`
	margin-bottom: 10px;
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

export const Calculating = () => {
	const dispatch = useDispatch()

	const workdayStatus = useSelector((state: RootState) => state.workdayStatus)

	console.log(workdayStatus, 'workday')

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

	const totalAmount =
		workdayStatus.workday * 13000 -
		workdayStatus.allHolidayCount * 13000 -
		workdayStatus.morningHoldayCount * 10000 +
		workdayStatus.extraMoneyCount * 10000

	const remainingAmount = workdayStatus.usageAmount
		? totalAmount - workdayStatus.usageAmount
		: totalAmount

	const willPayAmount = workdayStatus.specialDayList.reduce(
		(sum, item) => sum + item.amount,
		0,
	)

	const averageAmount = (
		(remainingAmount - willPayAmount) /
		(workdayStatus.workRemaningDay -
			workdayStatus.afterTodayHolidayCount -
			workdayStatus.specialDayList.length)
	).toFixed(1)

	if (workdayStatus.workday === 0) {
		return <></>
	}

	return (
		<>
			<StyledInput
				placeholder="이곳에 고위드 이용금액을 확인하고 입력하세요!"
				onChange={handleChange}
				value={workdayStatus.usageAmount}
			/>
			<div style={{ marginTop: 10, textAlign: 'center' }}>
				<ResponsiveWrapper>
					<GirdCard hoverable>
						<Card.Meta title={<>기본 정보</>} />
						<CalculatingWrapper>
							<CalculatingContent>
								기본 제공 식대 :&nbsp;
								{numberWithCommas(workdayStatus.workday * 13000)}원 (
								{workdayStatus.workday}일)
							</CalculatingContent>
							<CalculatingContent>
								{workdayStatus.allHolidayCount === 0
									? `휴가 차감 금액 : 0원 (0일)`
									: `휴가 차감 금액 : -${numberWithCommas(workdayStatus.allHolidayCount * 13000)}원 (${workdayStatus.allHolidayCount}일)`}
							</CalculatingContent>
							<CalculatingContent>
								{workdayStatus.morningHoldayCount === 0
									? `오전반차 차감 금액 : 0원 (0일)`
									: `오전반차 차감 금액 : -${numberWithCommas(workdayStatus.morningHoldayCount * 10000)}원 (${workdayStatus.morningHoldayCount}일)`}
							</CalculatingContent>
							<CalculatingContent>
								{workdayStatus.extraMoneyCount === 0
									? `야근 추가 식대 : 0원 (0회)`
									: `야근 추가 식대 : +${numberWithCommas(workdayStatus.extraMoneyCount * 10000)}원 (${workdayStatus.extraMoneyCount}회)`}
							</CalculatingContent>
						</CalculatingWrapper>
					</GirdCard>

					<GirdCard hoverable>
						<Card.Meta title={<>계산 정보</>} />
						<CalculatingWrapper>
							<CalculatingContent>
								현재 이용 금액 :
								{workdayStatus.usageAmount
									? numberWithCommas(workdayStatus.usageAmount)
									: '0'}
								원
							</CalculatingContent>
							<CalculatingContent>
								잔액 : {numberWithCommas(remainingAmount)}원
							</CalculatingContent>
						</CalculatingWrapper>
					</GirdCard>

					<GirdCard hoverable>
						<Card.Meta title={<>기타 정보</>} />
						<CalculatingWrapper>
							<CalculatingContent>
								<Tooltip
									title={
										<div
											style={{
												display: 'flex',
												flexDirection: 'column',
												width: 'fit-content',
												whiteSpace: 'nowrap',
											}}
										>
											<p>당일 점심을 먹은 이후면 근무일수로 취급x</p>
										</div>
									}
									color="black"
									overlayStyle={{ maxWidth: 'none' }}
								>
									<span style={{ textDecoration: 'underline' }}>
										남은 근무 일수
									</span>
								</Tooltip>
								<span>
									:
									{workdayStatus.workRemaningDay -
										workdayStatus.afterTodayHolidayCount}
									일
								</span>
							</CalculatingContent>
							<CalculatingContent>
								예상 지출 등록 일수 : {workdayStatus.specialDayList.length}일
							</CalculatingContent>
							<CalculatingContent>
								예상 지출 금액 : {numberWithCommas(willPayAmount)}원
							</CalculatingContent>
							<CalculatingContent>
								<Tooltip
									title={
										<div
											style={{
												display: 'flex',
												flexDirection: 'column',
												width: 'fit-content',
												whiteSpace: 'nowrap',
											}}
										>
											<p>
												(잔액-예상지출금액) ÷ (남은 근무 일수 - 예상 지출 등록
												일수)
											</p>
										</div>
									}
									color="black"
									overlayStyle={{ maxWidth: 'none' }}
								>
									<span style={{ textDecoration: 'underline' }}>
										남은 평균 금액
									</span>
								</Tooltip>
								{workdayStatus.workRemaningDay -
									workdayStatus.afterTodayHolidayCount ==
								0 ? (
									<span>
										{' '}
										: {numberWithCommas(remainingAmount)}
										{remainingAmount >= 0 ? `원😀😀😀` : `원🤢🤢🤢`}
									</span>
								) : (
									<span>
										:
										{Number(averageAmount) >= 13000
											? ` ${averageAmount}원😀`
											: ` ${averageAmount}원🤢`}
									</span>
								)}
							</CalculatingContent>
						</CalculatingWrapper>
					</GirdCard>
				</ResponsiveWrapper>
				<MobileWrapper>
					<Row gutter={24}>
						<Col span={8}>
							<StyledCard
								title={<CardTitleHeader>기본 정보</CardTitleHeader>}
								variant="borderless"
								hoverable
							>
								<CalculatingWrapper>
									<CalculatingContent>
										기본 제공 식대 :
										{numberWithCommas(workdayStatus.workday * 13000)}원 (
										{workdayStatus.workday}일)
									</CalculatingContent>
									<CalculatingContent>
										{workdayStatus.allHolidayCount === 0
											? `휴가 차감 금액 : 0원 (0일)`
											: `휴가 차감 금액 : -${numberWithCommas(workdayStatus.allHolidayCount * 13000)}원 (${workdayStatus.allHolidayCount}일)`}
									</CalculatingContent>
									<CalculatingContent>
										{workdayStatus.morningHoldayCount === 0
											? `오전반차 차감 금액 : 0원 (0일)`
											: `오전반차 차감 금액 : -${numberWithCommas(workdayStatus.morningHoldayCount * 10000)}원 (${workdayStatus.morningHoldayCount}일)`}
									</CalculatingContent>
									<CalculatingContent>
										{workdayStatus.extraMoneyCount === 0
											? `야근 추가 식대 : 0원 (0회)`
											: `야근 추가 식대 : +${numberWithCommas(workdayStatus.extraMoneyCount * 10000)}원 (${workdayStatus.extraMoneyCount}회)`}
									</CalculatingContent>
								</CalculatingWrapper>
							</StyledCard>
						</Col>
						<Col span={8}>
							<StyledCard
								title={<CardTitleHeader>계산 정보</CardTitleHeader>}
								variant="borderless"
								hoverable
							>
								<CalculatingWrapper>
									<CalculatingContent>
										현재 이용 금액 :
										{workdayStatus.usageAmount
											? numberWithCommas(workdayStatus.usageAmount)
											: '0'}
										원
									</CalculatingContent>
									<CalculatingContent>
										잔액 : {numberWithCommas(remainingAmount)}원
									</CalculatingContent>
								</CalculatingWrapper>
							</StyledCard>
						</Col>
						<Col span={8}>
							<StyledCard
								title={<CardTitleHeader>기타 정보</CardTitleHeader>}
								variant="borderless"
								hoverable
							>
								<CalculatingWrapper>
									<CalculatingContent>
										<Tooltip
											title={
												<div
													style={{
														display: 'flex',
														flexDirection: 'column',
														width: 'fit-content',
														whiteSpace: 'nowrap',
													}}
												>
													<p>당일 점심을 먹은 이후면 근무일수로 취급x</p>
												</div>
											}
											color="black"
											overlayStyle={{ maxWidth: 'none' }}
										>
											<span style={{ textDecoration: 'underline' }}>
												남은 근무 일수
											</span>
										</Tooltip>
										<span>
											:
											{workdayStatus.workRemaningDay -
												workdayStatus.afterTodayHolidayCount}
											일
										</span>
									</CalculatingContent>
									<CalculatingContent>
										예상 지출 등록 일수 : {workdayStatus.specialDayList.length}
										일
									</CalculatingContent>
									<CalculatingContent>
										예상 지출 금액 : {numberWithCommas(willPayAmount)}원
									</CalculatingContent>
									<CalculatingContent>
										<Tooltip
											title={
												<div
													style={{
														display: 'flex',
														flexDirection: 'column',
														width: 'fit-content',
														whiteSpace: 'nowrap',
													}}
												>
													<p>
														(잔액-예상지출금액) ÷ (남은 근무 일수 - 예상 지출
														등록 일수)
													</p>
												</div>
											}
											color="black"
											overlayStyle={{ maxWidth: 'none' }}
										>
											<span style={{ textDecoration: 'underline' }}>
												남은 평균 금액
											</span>
										</Tooltip>
										{workdayStatus.workRemaningDay -
											workdayStatus.afterTodayHolidayCount ==
										0 ? (
											<span>
												{' '}
												: {numberWithCommas(remainingAmount)}
												{remainingAmount >= 0 ? `원😀😀😀` : `원🤢🤢🤢`}
											</span>
										) : (
											<span>
												:
												{Number(averageAmount) >= 13000
													? ` ${averageAmount}원😀`
													: ` ${averageAmount}원🤢`}
											</span>
										)}
									</CalculatingContent>
								</CalculatingWrapper>
							</StyledCard>
						</Col>
					</Row>
				</MobileWrapper>
			</div>
		</>
	)
}
