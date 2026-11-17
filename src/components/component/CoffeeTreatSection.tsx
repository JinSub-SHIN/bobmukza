import { useCallback, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { CloseOutlined } from '@ant-design/icons'
import { Button, Input, Modal, Tag, message } from 'antd'
import { theme } from '../../styles/theme'
import {
	CoffeeMemberPreset,
	createCoffeePreset,
	deleteCoffeePreset,
	listCoffeePresets,
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
	gap: 10px;
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
	align-items: center;
`

const PresetChip = styled.div`
	display: inline-flex;
	align-items: center;
	gap: 0;
	border-radius: 8px;
	overflow: hidden;
	border: 1px solid ${theme.line};
	background: #fff;
`

const PresetLoadBtn = styled.button`
	appearance: none;
	border: 0;
	padding: 6px 12px;
	font-family: ${theme.fontBody};
	font-size: 0.88rem;
	font-weight: 600;
	color: ${theme.ink};
	background: transparent;
	cursor: pointer;

	&:hover {
		background: ${theme.tealSoft};
	}
`

const PresetDeleteBtn = styled.button`
	appearance: none;
	border: 0;
	border-left: 1px solid ${theme.line};
	padding: 6px 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: ${theme.minus};
	background: transparent;
	cursor: pointer;

	&:hover {
		background: rgba(194, 59, 46, 0.08);
	}
`

const EmptyPresetHint = styled.span`
	font-size: 0.88rem;
	color: ${theme.inkSoft};
`

const SlotBlock = styled.div`
	margin-top: 8px;
	padding-top: 12px;
	border-top: 1px solid ${theme.line};
`

const modalPop = keyframes`
	from {
		opacity: 0;
		transform: scale(0.96) translateY(6px);
	}
	to {
		opacity: 1;
		transform: scale(1) translateY(0);
	}
`

const CoffeePresetModal = styled(Modal)`
	&& .ant-modal-content {
		padding: 0;
		border-radius: ${theme.radius};
		border: 1px solid ${theme.line};
		background: linear-gradient(
			165deg,
			rgba(255, 255, 255, 0.98) 0%,
			rgba(243, 247, 245, 0.96) 100%
		);
		box-shadow: ${theme.shadowHover};
		overflow: hidden;
		font-family: ${theme.fontBody};
		animation: ${modalPop} 0.28s ease both;
	}

	&& .ant-modal-header {
		margin: 0;
		padding: 18px 22px 14px;
		background: transparent;
		border-bottom: 1px solid ${theme.line};
	}

	&& .ant-modal-title {
		font-family: ${theme.fontDisplay};
		font-size: 1.15rem;
		font-weight: 700;
		color: ${theme.ink};
		letter-spacing: -0.02em;
	}

	&& .ant-modal-body {
		padding: 18px 22px 8px;
	}

	&& .ant-modal-footer {
		margin: 0;
		padding: 14px 22px 18px;
		border: none;
		background: rgba(255, 255, 255, 0.6);
	}
`

const ModalLead = styled.p`
	margin: 0 0 14px;
	font-size: 0.92rem;
	line-height: 1.55;
	color: ${theme.inkSoft};
	font-weight: 500;

	strong {
		color: ${theme.teal};
		font-weight: 700;
	}
`

const ModalField = styled(Input)`
	border-radius: 10px !important;
	min-height: 44px;
	font-weight: 600;
	border-color: ${theme.line} !important;

	&:focus,
	&.ant-input-focused {
		border-color: ${theme.teal} !important;
		box-shadow: 0 0 0 3px ${theme.tealSoft} !important;
	}
`

const ModalFooterActions = styled.div`
	display: flex;
	justify-content: flex-end;
	gap: 8px;
`

const CancelModalBtn = styled(Button)`
	height: 42px !important;
	padding: 0 18px !important;
	border-radius: 10px !important;
	font-weight: 600 !important;
	border-color: ${theme.line} !important;
`

const SaveModalBtn = styled(Button)`
	height: 42px !important;
	padding: 0 20px !important;
	border-radius: 10px !important;
	border: none !important;
	font-weight: 700 !important;
	color: #fff !important;
	background: linear-gradient(
		135deg,
		${theme.teal} 0%,
		#0b6b62 100%
	) !important;
	box-shadow: 0 8px 20px rgba(15, 143, 130, 0.28);

	&:hover:not(:disabled) {
		color: #fff !important;
		background: linear-gradient(135deg, #11a396 0%, #0a5c54 100%) !important;
	}
`

export const CoffeeTreatSection = () => {
	const [draft, setDraft] = useState('')
	/** 탭을 다시 열면 목록 초기화 — 프리셋으로만 복구 */
	const [members, setMembers] = useState<string[]>([])
	const [membersVersion, setMembersVersion] = useState(0)
	const [presets, setPresets] =
		useState<CoffeeMemberPreset[]>(listCoffeePresets)
	const [saveModalOpen, setSaveModalOpen] = useState(false)
	const [presetLabelDraft, setPresetLabelDraft] = useState('')

	const bumpMembers = useCallback((next: string[]) => {
		setMembers(next)
		setMembersVersion(v => v + 1)
	}, [])

	const refreshPresets = () => {
		setPresets(listCoffeePresets())
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

	const openSaveModal = () => {
		if (members.length === 0) {
			message.warning('저장할 참여자가 없어요.')
			return
		}
		setPresetLabelDraft('')
		setSaveModalOpen(true)
	}

	const closeSaveModal = () => {
		setSaveModalOpen(false)
		setPresetLabelDraft('')
	}

	const confirmSavePreset = () => {
		const result = createCoffeePreset(presetLabelDraft, members)
		if (!result.ok) {
			message.warning(result.message)
			return
		}
		refreshPresets()
		closeSaveModal()
		message.success(`「${result.preset.label}」 프리셋을 저장했어요.`)
	}

	const applyPreset = (preset: CoffeeMemberPreset) => {
		bumpMembers([...preset.members])
		message.success(
			`「${preset.label}」을 불러왔어요. (${preset.members.length}명)`,
		)
	}

	const removePreset = (preset: CoffeeMemberPreset) => {
		const removed = deleteCoffeePreset(preset.id)
		if (!removed) {
			message.info('이미 삭제된 프리셋이에요.')
			refreshPresets()
			return
		}
		refreshPresets()
		message.success(`「${preset.label}」 프리셋을 삭제했어요.`)
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
					<Button type="default" block onClick={openSaveModal}>
						현재 멤버로 프리셋 저장하기
					</Button>

					<div>
						<PresetLabel>프리셋 불러오기</PresetLabel>
						<PresetRow style={{ marginTop: 8 }}>
							{presets.length === 0 ? (
								<EmptyPresetHint>저장된 프리셋이 없어요.</EmptyPresetHint>
							) : (
								presets.map(preset => (
									<PresetChip key={preset.id}>
										<PresetLoadBtn
											type="button"
											onClick={() => applyPreset(preset)}
										>
											{preset.label} ({preset.members.length})
										</PresetLoadBtn>
										<PresetDeleteBtn
											type="button"
											aria-label={`${preset.label} 삭제`}
											onClick={() => removePreset(preset)}
										>
											<CloseOutlined />
										</PresetDeleteBtn>
									</PresetChip>
								))
							)}
						</PresetRow>
					</div>
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

			<CoffeePresetModal
				title="프리셋 저장"
				open={saveModalOpen}
				centered
				width={Math.min(
					400,
					typeof window !== 'undefined' ? window.innerWidth * 0.92 : 400,
				)}
				maskStyle={{
					background: 'rgba(20, 35, 28, 0.45)',
					backdropFilter: 'blur(6px)',
				}}
				onCancel={closeSaveModal}
				destroyOnClose
				footer={
					<ModalFooterActions>
						<CancelModalBtn onClick={closeSaveModal}>취소</CancelModalBtn>
						<SaveModalBtn type="primary" onClick={confirmSavePreset}>
							저장
						</SaveModalBtn>
					</ModalFooterActions>
				}
			>
				<ModalLead>
					프리셋명을 입력해 주세요. 현재 멤버{' '}
					<strong>{members.length}명</strong>이 저장돼요.
				</ModalLead>
				<ModalField
					placeholder="예: 점심팀, 3층 개발"
					value={presetLabelDraft}
					onChange={e => setPresetLabelDraft(e.target.value)}
					onPressEnter={confirmSavePreset}
					maxLength={24}
					autoFocus
				/>
			</CoffeePresetModal>
		</>
	)
}
