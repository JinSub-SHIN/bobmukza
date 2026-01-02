import { Button, Form, Input, Select } from 'antd'
import type { FormProps } from 'antd'
import { TonsilLayout } from '../../../common/TonsilLayout'
import { supabase } from '../../../database/supabase'
import { styled } from 'styled-components'

const SubmitButton = styled(Button)`
	width: 100%;
	height: 48px;
	background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
	border: none !important;
	font-size: 16px;
	font-weight: 700;
	box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
	color: #fff !important;

	&:hover,
	&:focus,
	&:active {
		background: linear-gradient(135deg, #059669 0%, #047857 100%) !important;
		box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4) !important;
		border: none !important;
		color: #fff !important;
	}
`

type FieldType = {
	title?: string
	agonist?: string
	antagonist?: string
	synergist?: string
	type?: string
}

export const InsertWorkOut = () => {
	const [form] = Form.useForm()

	const insertExercise = async (values: FieldType) => {
		const { error } = await supabase.from('workoutList').insert([
			{
				title: values.title,
				agonist: values.agonist,
				antagonist: values.antagonist,
				synergist: values.synergist,
				type: values.type,
			},
		])

		if (error) {
			console.error(error)
			alert('저장 실패')
		} else {
			alert('저장 완료')
			form.resetFields() // 폼 초기화
		}
	}

	const onFinish: FormProps<FieldType>['onFinish'] = values => {
		console.log('Success:', values)
		insertExercise(values)
	}

	return (
		<TonsilLayout>
			<div style={{ padding: 50 }}>
				<h2 style={{ marginBottom: 20 }}>개발자 전용 - 운동목록 등록</h2>
				<Form
					layout={'vertical'}
					form={form}
					initialValues={{ layout: 'vertical' }}
					onFinish={onFinish}
				>
					<Form.Item
						label="운동명칭"
						name="title"
						rules={[{ required: true, message: '운동명칭을 입력해주세요' }]}
					>
						<Input placeholder="ex) 바벨 벤치프레스, 덤벨 벤치프레스" />
					</Form.Item>
					<Form.Item
						label="운동부위(주동근)"
						name="agonist"
						rules={[{ required: true, message: '운동부위를 선택해주세요' }]}
					>
						<Select placeholder="운동부위를 선택하세요">
							<Select.Option value="가슴">가슴</Select.Option>
							<Select.Option value="등">등</Select.Option>
							<Select.Option value="어깨">어깨</Select.Option>
							<Select.Option value="팔">팔</Select.Option>
							<Select.Option value="하체">하체</Select.Option>
							<Select.Option value="유산소">유산소</Select.Option>
							<Select.Option value="기타">기타</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item label="반대근육(길항근)" name="antagonist">
						<Input placeholder="ex) 델토이드" />
					</Form.Item>
					<Form.Item label="협력근" name="synergist">
						<Input placeholder="ex) 대원근" />
					</Form.Item>
					<Form.Item
						label="종류"
						name="type"
						rules={[{ required: true, message: '종류를 선택해주세요' }]}
					>
						<Select placeholder="뭘 가지고 하나요?">
							<Select.Option value="바벨">바벨</Select.Option>
							<Select.Option value="덤벨">덤벨</Select.Option>
							<Select.Option value="머신">머신</Select.Option>
							<Select.Option value="케이블">케이블</Select.Option>
							<Select.Option value="스미스">스미스</Select.Option>
							<Select.Option value="맨몸">맨몸</Select.Option>
						</Select>
					</Form.Item>
					<div style={{ height: 10 }}></div>
					<Form.Item>
						<SubmitButton type="primary" htmlType="submit">
							등록
						</SubmitButton>
					</Form.Item>
				</Form>
			</div>
		</TonsilLayout>
	)
}
