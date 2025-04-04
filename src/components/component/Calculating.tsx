import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { RootState } from '../../store'
import { numberWithCommas } from '../hook/useNumberComma'
import { setWorkday } from '../../store/action/workdaySlice'
import { Card, Col, Input, Row, Tooltip } from 'antd'

const CalculatingWrapper = styled.div`
	margin-top: 10px;
	padding: 25px;
	font-size: 25px;
`

const StyledInput = styled(Input)`
	height: 70px;

	& ::placeholder {
		color: black !important;
		font-size: 20px !important;
	}
`

const StyledCard = styled(Card)`
	min-height: 500px;
`

const CalculatingContent = styled.div`
	margin-top: 5px;
`

const CardTitleHeader = styled.div`
	line-height: 100px;
`

export const Calculating = () => {
	const dispatch = useDispatch()

	const workdayStatus = useSelector((state: RootState) => state.workdayStatus)

	const numberRegexp = (inputValue: string) => {
		const allowedRegex = /^[0-9]+$/
		return allowedRegex.test(inputValue)
	}

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
		workdayStatus.holidayTotalCount * 13000 +
		workdayStatus.extraMoneyCount * 10000

	const remainingAmount = workdayStatus.usageAmount
		? totalAmount - workdayStatus.usageAmount
		: totalAmount

	const averageAmount = (
		remainingAmount /
		(workdayStatus.workRemaningDay - workdayStatus.afterTodayHolidayCount)
	).toFixed(1)

	return (
		<>
			<StyledInput
				placeholder="현재 까지 사용한 금액 입력"
				variant="filled"
				onChange={handleChange}
				value={workdayStatus.usageAmount}
				type="number"
			/>
			<div style={{ marginTop: 30, textAlign: 'center' }}>
				<Row gutter={24}>
					<Col span={8}>
						<StyledCard
							title={<CardTitleHeader>기본 정보</CardTitleHeader>}
							variant="borderless"
							hoverable
						>
							<CalculatingWrapper>
								<CalculatingContent>
									기본 제공 식대 :{' '}
									{numberWithCommas(workdayStatus.workday * 13000)}원 (
									{workdayStatus.workday}일)
								</CalculatingContent>
								<CalculatingContent>
									{workdayStatus.holidayTotalCount === 0
										? `휴가 차감 금액 : 0원 (0일)`
										: `휴가 차감 금액 : -${numberWithCommas(workdayStatus.holidayTotalCount * 13000)}원 (${workdayStatus.holidayTotalCount}일)`}
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
									현재 이용 금액 :{' '}
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
												<p>점심먹기 이전이라면 근무일로 !</p>
												<p>점심먹기 이후라면 근무일이 지난것으로 취급해요 !</p>
											</div>
										}
										color="orange"
										overlayStyle={{ maxWidth: 'none' }}
									>
										남은 근무 일수 :
										{workdayStatus.workRemaningDay -
											workdayStatus.afterTodayHolidayCount}
										일
									</Tooltip>
								</CalculatingContent>
								<CalculatingContent>
									남은 평균 금액 :
									{Number(averageAmount) >= 13000
										? ` ${averageAmount}원😀`
										: ` ${averageAmount}원🤢`}
								</CalculatingContent>
							</CalculatingWrapper>
						</StyledCard>
					</Col>
				</Row>
			</div>
		</>
	)
}
