import { useCallback, useState } from 'react'
import styled from 'styled-components'
import { Button, Input, Popconfirm, Tag, message } from 'antd'
import { theme } from '../../styles/theme'
import {
	CoffeePresetSlot,
	clearCoffeePreset,
	getCoffeePresetCounts,
	loadCoffeePreset,
	saveCoffeePreset,
} from '../../auth/coffeeParticipantStorage'
import { CoffeeSlotMachine } from './CoffeeSlotMachine'

const PageIntro = styled.div`
	width: 100%;
	margin: 0 0 18px;
	padding: 16px 20px;
	box-sizing: border-box;
	border-radius: ${theme.radius};
	background: rgba(255, 255, 255, 0.88);
	border: 1px solid ${theme.line};
	box-shadow: 0 10px 28px rgba(20, 35, 28, 0.06);

	h2 {
		margin: 0 0 6px;
		font-family: ${theme.fontDisplay};
		font-size: clamp(1.6rem, 3vw, 2.1rem);
		color: #0d1713;
	}

	p {
		margin: 0;
		color: #2f433a;
		font-size: 0.98rem;
		font-weight: 500;
		line-height: 1.55;
	}
`

const Panel = styled.div`
	width: 100%;
	padding: 22px 20px;
	box-sizing: border-box;
	border-radius: ${theme.radius};
	background: linear-gradient(
		160deg,
		rgba(255, 255, 255, 0.88) 0%,
		rgba(243, 247, 245, 0.92) 100%
	);
	border: 1px solid ${theme.line};
	box-shadow: ${theme.shadow};
	min-height: min(520px, calc(100vh - 280px));
`

const Row = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	margin-bottom: 14px;
`

const AddRow = styled.div`
	display: flex;
	gap: 8px;
	margin-bottom: 14px;

	@media (max-width: 600px) {
		flex-direction: column;
	}
`

const PresetBar = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin-bottom: 16px;
	padding: 12px 14px;
	border-radius: ${theme.radiusSm};
	background: rgba(255, 255, 255, 0.72);
	border: 1px solid ${theme.line};
`

const PresetLabel = styled.span`
	font-size: 0.8rem;
	font-weight: 700;
	color: ${theme.inkSoft};
`

const PresetRow = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
`

const PresetSlot = styled.div`
	display: inline-flex;
	align-items: stretch;
	gap: 4px;
`

const SlotBlock = styled.div`
	margin-top: 8px;
	padding-top: 12px;
	border-top: 1px solid ${theme.line};
`

export const CoffeeTreatSection = () => {
	const [draft, setDraft] = useState('')
	/** 탭을 다시 열면 목록 초기화 — 프리셋으로만 복구 */
	const [members, setMembers] = useState<string[]>([])
	const [membersVersion, setMembersVersion] = useState(0)
	const [presetCounts, setPresetCounts] = useState(getCoffeePresetCounts)

	const bumpMembers = useCallback((next: string[]) => {
		setMembers(next)
		setMembersVersion(v => v + 1)
	}, [])

	const refreshPresetCounts = () => {
		setPresetCounts(getCoffeePresetCounts())
	}

	const addMember = () => {
		const name = draft.trim()
		if (!name) {
			return
		}
		if (members.some(m => m === name)) {
			message.warning('이미 있는 이름이에요.')
			return
		}
		bumpMembers([...members, name])
		setDraft('')
	}

	const removeMember = (name: string) => {
		bumpMembers(members.filter(m => m !== name))
	}

	const applyPreset = (slot: CoffeePresetSlot) => {
		const saved = loadCoffeePreset(slot)
		if (!saved || saved.length === 0) {
			message.info(`프리셋 ${slot}에 저장된 이름이 없어요.`)
			return
		}
		bumpMembers(saved)
		message.success(`프리셋 ${slot}을 불러왔어요. (${saved.length}명)`)
	}

	const storePreset = (slot: CoffeePresetSlot) => {
		if (members.length === 0) {
			message.warning('저장할 참여자가 없어요.')
			return
		}
		saveCoffeePreset(slot, members)
		refreshPresetCounts()
		message.success(`프리셋 ${slot}에 저장했어요. (${members.length}명)`)
	}

	const resetPreset = (slot: CoffeePresetSlot) => {
		const cleared = clearCoffeePreset(slot)
		if (!cleared) {
			message.info(`프리셋 ${slot}은 이미 비어 있어요.`)
			return
		}
		refreshPresetCounts()
		message.success(`프리셋 ${slot}을 초기화했어요.`)
	}

	return (
		<>
			<PageIntro>
				<h2>오늘 커피, 누가 쏠까</h2>
				<p>
					탭을 바꿨다 들어오면 목록은 비워져요. 프리셋을 불러오거나 이름을
					추가한 뒤 슬롯을 돌려 주세요.
				</p>
			</PageIntro>

			<Panel>
				<AddRow>
					<Input
						placeholder="이름 입력"
						value={draft}
						onChange={e => setDraft(e.target.value)}
						onPressEnter={addMember}
						maxLength={20}
					/>
					<Button type="primary" onClick={addMember}>
						추가
					</Button>
				</AddRow>

				<PresetBar>
					<PresetLabel>프리셋 불러오기</PresetLabel>
					<PresetRow>
						{([1, 2, 3] as const).map(slot => (
							<PresetSlot key={`preset-${slot}`}>
								<Button
									onClick={() => applyPreset(slot)}
									disabled={presetCounts[slot] === 0}
								>
									프리셋 {slot}
									{presetCounts[slot] > 0 ? ` (${presetCounts[slot]})` : ''}
								</Button>
								<Popconfirm
									title={`프리셋 ${slot}을 비울까요?`}
									okText="초기화"
									cancelText="취소"
									onConfirm={() => resetPreset(slot)}
									disabled={presetCounts[slot] === 0}
								>
									<Button
										danger
										disabled={presetCounts[slot] === 0}
										aria-label={`프리셋 ${slot} 초기화`}
									>
										초기화
									</Button>
								</Popconfirm>
							</PresetSlot>
						))}
					</PresetRow>
					<PresetLabel>현재 목록 저장</PresetLabel>
					<PresetRow>
						{([1, 2, 3] as const).map(slot => (
							<Button key={`save-${slot}`} onClick={() => storePreset(slot)}>
								프리셋 {slot} 에 저장
							</Button>
						))}
					</PresetRow>
				</PresetBar>

				<Row>
					{members.length === 0 ? (
						<span style={{ color: theme.inkSoft, fontSize: '0.92rem' }}>
							참여자를 추가해 주세요.
						</span>
					) : (
						members.map(name => (
							<Tag
								key={name}
								closable
								onClose={() => removeMember(name)}
								color="processing"
							>
								{name}
							</Tag>
						))
					)}
				</Row>

				<SlotBlock>
					<CoffeeSlotMachine key={membersVersion} names={members} />
				</SlotBlock>
			</Panel>
		</>
	)
}
