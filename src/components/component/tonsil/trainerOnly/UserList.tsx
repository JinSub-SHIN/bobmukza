import { useState, useEffect } from 'react'
import { styled } from 'styled-components'
import { List, Card, Spin, Avatar, Modal } from 'antd'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../../database/supabase'
import {
	CalendarOutlined,
	UserOutlined,
	CloseOutlined,
} from '@ant-design/icons'

const Container = styled.div`
	padding: 24px;
	max-width: 1400px;
	margin: 0 auto;

	@media screen and (max-width: 768px) {
		padding: 16px;
	}
`

const Title = styled.h1`
	font-size: 28px;
	font-weight: 700;
	margin-bottom: 32px;
	color: #1a1a1a;
	background: linear-gradient(135deg, #10b981 0%, #059669 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;

	@media screen and (max-width: 768px) {
		font-size: 22px;
		margin-bottom: 24px;
	}
`

const CardWrapper = styled.div`
	position: relative;
	height: 100%;
`

const StyledCard = styled(Card)`
	border-radius: 16px;
	border: 1px solid #e5e7eb;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	margin-bottom: 0;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	cursor: pointer;
	height: 100%;
	overflow: hidden;
	background: #ffffff;

	&:hover {
		box-shadow: 0 8px 24px rgba(16, 185, 129, 0.15);
		transform: translateY(-4px);
		border-color: #10b981;
	}

	.ant-card-body {
		padding: 24px;
	}

	@media screen and (max-width: 768px) {
		border-radius: 12px;

		.ant-card-body {
			padding: 20px;
		}
	}
`

const DeleteButton = styled.button`
	position: absolute;
	top: 12px;
	right: 12px;
	width: 32px;
	height: 32px;
	border-radius: 50%;
	border: none;
	background: rgba(239, 68, 68, 0.1);
	color: #ef4444;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s ease;
	z-index: 10;

	&:hover {
		background: #ef4444;
		color: white;
		transform: scale(1.1);
	}

	&:active {
		transform: scale(0.95);
	}

	@media screen and (max-width: 768px) {
		width: 28px;
		height: 28px;
		top: 10px;
		right: 10px;
	}
`

const CardContent = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	gap: 16px;
`

const StyledAvatar = styled(Avatar)`
	box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
	transition: all 0.3s ease;
	background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;

	${StyledCard}:hover & {
		transform: scale(1.1);
		box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
	}

	@media screen and (max-width: 768px) {
		width: 64px !important;
		height: 64px !important;
		font-size: 24px !important;
	}
`

const UserInfo = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	width: 100%;
`

const UserName = styled.div`
	font-size: 20px;
	font-weight: 700;
	color: #1a1a1a;
	transition: color 0.2s ease;
	word-break: break-word;

	${StyledCard}:hover & {
		color: #10b981;
	}

	@media screen and (max-width: 768px) {
		font-size: 18px;
	}
`

const JoinDate = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 6px;
	font-size: 13px;
	color: #9ca3af;
	margin-top: 8px;
	padding-top: 12px;
	border-top: 1px solid #f3f4f6;
`

const EmptyContainer = styled.div`
	text-align: center;
	padding: 60px 20px;
	color: #999;
	font-size: 16px;

	@media screen and (max-width: 768px) {
		padding: 40px 20px;
		font-size: 14px;
	}
`

type UserData = {
	user_id: string
	user_name: string
	user_type: number
	with_who: string | null
	created_at?: string
}

export const UserList = () => {
	const navigate = useNavigate()
	const [users, setUsers] = useState<UserData[]>([])
	const [loading, setLoading] = useState(true)
	const [deleteModalOpen, setDeleteModalOpen] = useState(false)
	const [userToDelete, setUserToDelete] = useState<{
		userId: string
		userName: string
	} | null>(null)
	const [deleting, setDeleting] = useState(false)
	const trainerUserId = localStorage.getItem('userId')
	const trainerUserName = localStorage.getItem('userName') || '트레이너'

	const handleUserClick = (userId: string, userName: string) => {
		navigate(
			`/workout/calendar?userId=${userId}&userName=${encodeURIComponent(userName)}`,
		)
	}

	const handleDeleteClick = (
		e: React.MouseEvent,
		userId: string,
		userName: string,
	) => {
		e.stopPropagation()
		setUserToDelete({ userId, userName })
		setDeleteModalOpen(true)
	}

	const handleDeleteConfirm = async () => {
		if (!userToDelete) return

		setDeleting(true)
		try {
			const { error } = await supabase
				.from('users')
				.update({ with_who: null })
				.eq('user_id', userToDelete.userId)

			if (error) {
				console.error('Error updating user:', error)
				Modal.error({
					title: '처리 실패',
					content: '회원 정보 업데이트 중 오류가 발생했습니다.',
					centered: true,
					okButtonProps: {
						style: {
							background: '#ef4444',
							borderColor: '#ef4444',
						},
					},
				})
			} else {
				Modal.success({
					title: '처리 완료',
					content: '회원이 관리 목록에서 제거되었습니다.',
					centered: true,
					okText: '확인',
					okButtonProps: {
						style: {
							background: '#10b981',
							borderColor: '#10b981',
						},
					},
				})
				// 목록 새로고침
				await fetchUsers()
			}
		} catch (error) {
			console.error('Error:', error)
			Modal.error({
				title: '처리 실패',
				content: '회원 정보 업데이트 중 오류가 발생했습니다.',
				centered: true,
				okButtonProps: {
					style: {
						background: '#ef4444',
						borderColor: '#ef4444',
					},
				},
			})
		} finally {
			setDeleting(false)
			setDeleteModalOpen(false)
			setUserToDelete(null)
		}
	}

	const handleDeleteCancel = () => {
		setDeleteModalOpen(false)
		setUserToDelete(null)
	}

	useEffect(() => {
		fetchUsers()
	}, [])

	const fetchUsers = async () => {
		if (!trainerUserId) {
			setLoading(false)
			return
		}

		setLoading(true)
		try {
			const { data, error } = await supabase
				.from('users')
				.select('user_id, user_name, user_type, with_who, created_at, id')
				.eq('with_who', trainerUserId)

			if (error) {
				console.error('Error fetching users:', error)
				setLoading(false)
				return
			}

			if (data) {
				setUsers(data as UserData[])
			}
		} catch (error) {
			console.error('Error:', error)
		} finally {
			setLoading(false)
		}
	}

	if (loading) {
		return (
			<Container>
				<Spin
					size="large"
					style={{ display: 'block', textAlign: 'center', padding: '60px' }}
				/>
			</Container>
		)
	}

	return (
		<Container>
			<Title>{trainerUserName} 님의 회원 관리</Title>
			{users.length === 0 ? (
				<EmptyContainer>등록된 회원이 없습니다.</EmptyContainer>
			) : (
				<List
					grid={{
						gutter: [20, 20],
						xs: 1,
						sm: 2,
						md: 2,
						lg: 3,
						xl: 4,
						xxl: 4,
					}}
					dataSource={users}
					renderItem={user => {
						const formatDate = (dateString?: string) => {
							if (!dateString) return '날짜 없음'
							const date = new Date(dateString)
							return date.toLocaleDateString('ko-KR', {
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							})
						}
						return (
							<List.Item>
								<CardWrapper>
									<DeleteButton
										onClick={e =>
											handleDeleteClick(
												e,
												user.user_id,
												user.user_name || '이름 없음',
											)
										}
									>
										<CloseOutlined />
									</DeleteButton>
									<StyledCard
										onClick={() =>
											handleUserClick(
												user.user_id,
												user.user_name || '이름 없음',
											)
										}
									>
										<CardContent>
											<StyledAvatar size={80}>
												<UserOutlined />
											</StyledAvatar>
											<UserInfo>
												<UserName>{user.user_name || '이름 없음'}</UserName>
												<JoinDate>
													<CalendarOutlined />
													가입일: {formatDate(user.created_at)}
												</JoinDate>
											</UserInfo>
										</CardContent>
									</StyledCard>
								</CardWrapper>
							</List.Item>
						)
					}}
				/>
			)}
			<Modal
				title={
					<div style={{ fontSize: '20px', fontWeight: 600, color: '#1a1a1a' }}>
						회원 제거
					</div>
				}
				open={deleteModalOpen}
				onOk={handleDeleteConfirm}
				onCancel={handleDeleteCancel}
				confirmLoading={deleting}
				okText="제거"
				cancelText="아니요"
				okButtonProps={{
					danger: true,
					style: {
						height: '40px',
						fontSize: '15px',
						fontWeight: 600,
						borderRadius: '8px',
					},
				}}
				cancelButtonProps={{
					style: {
						height: '40px',
						fontSize: '15px',
						fontWeight: 600,
						borderRadius: '8px',
					},
				}}
				centered
				width={420}
				styles={{
					content: {
						borderRadius: '16px',
						padding: '24px',
					},
					header: {
						borderBottom: '1px solid #f0f0f0',
						paddingBottom: '16px',
						marginBottom: '20px',
					},
					body: {
						padding: '0',
					},
					footer: {
						borderTop: '1px solid #f0f0f0',
						paddingTop: '16px',
						marginTop: '24px',
					},
				}}
			>
				<div style={{ fontSize: '16px', lineHeight: '1.6', color: '#4b5563' }}>
					<strong style={{ color: '#1a1a1a' }}>{userToDelete?.userName}</strong>{' '}
					회원을 제거하시겠습니까?
				</div>
			</Modal>
		</Container>
	)
}
