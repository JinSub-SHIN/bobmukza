import { useState } from 'react'
import styled from 'styled-components'
import { Button, Input, Tag, message } from 'antd'
import { theme } from '../../styles/theme'
import { getBobmukzaUserName } from '../../auth/bobmukzaSession'
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
	margin-bottom: 18px;

	@media (max-width: 600px) {
		flex-direction: column;
	}
`

const SlotBlock = styled.div`
	margin-top: 8px;
	padding-top: 12px;
	border-top: 1px solid ${theme.line};
`

const defaultNames = () => {
	const me = getBobmukzaUserName()?.trim()
	return me ? [me] : []
}

export const CoffeeTreatSection = () => {
	const [draft, setDraft] = useState('')
	const [members, setMembers] = useState<string[]>(defaultNames)
	const [membersVersion, setMembersVersion] = useState(0)

	const addMember = () => {
		const name = draft.trim()
		if (!name) {
			return
		}
		if (members.some(m => m === name)) {
			message.warning('이미 있는 이름이에요.')
			return
		}
		setMembers(prev => [...prev, name])
		setDraft('')
		setMembersVersion(v => v + 1)
	}

	const removeMember = (name: string) => {
		setMembers(prev => prev.filter(m => m !== name))
		setMembersVersion(v => v + 1)
	}

	return (
		<>
			<PageIntro>
				<h2>오늘 커피, 누가 쏠까</h2>
				<p>참여자를 넣고 슬롯을 돌리면 세 릴이 맞춰진 사람이 커피 담당이 됩니다.</p>
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