import { Button, Flex, Form, Input, Select, Watermark } from 'antd'
import type { SelectProps } from 'antd'
import { buyTetherApi, coinListApi, getTetherPriceApi } from '../../../api'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import CryptoJS from 'crypto-js'

type FieldType = {
	coinName?: string
	volume?: string
	price?: string
	apiKey?: string
	secretKey?: string
}

export interface CoinList {
	market: string
	korean_name: string
	english_name: string
}

export const Coin = () => {
	const [_, setApiFormData] = useState<FieldType>({})
	const [getCoinPrice, setGetCoinPrice] = useState<number>(0)
	const [isBuy, setIsBuy] = useState<boolean>(false)
	const [data, setData] = useState<SelectProps['options']>([])
	const [priceValue, setPriceValue] = useState<string>()
	const [priceCoinKeyValue, setPriceCoinKeyValue] = useState<string>()
	const [realBuyValue, setRealBuyValue] = useState<string>()
	const [realSellValue, setRealSellValue] = useState<string>()

	useEffect(() => {
		console.log(priceValue, priceCoinKeyValue)
	}, [priceValue, priceCoinKeyValue])

	const handleCoinPrice = () => {
		if (priceCoinKeyValue) {
			const response: any = getTetherPriceApi(priceCoinKeyValue)
			response.then((res: any) => {
				setGetCoinPrice(res.data[0].trade_price)
			})
		} else {
		}
	}
	const handleByeCoin = async (type: string, values: FieldType) => {
		setApiFormData(values)

		const accessKey = values.apiKey || ''
		const secretKey = values.secretKey || ''

		// Set API parameters (POST request body)
		const params = {
			market: type === 'buy' ? realBuyValue : realSellValue,
			side: type === 'buy' ? 'bid' : 'ask',
			volume: values.volume,
			price: values.price,
			ord_type: 'limit',
		}

		// Convert POST body to query string (like querystring.encode)
		const query = new URLSearchParams(
			Object.entries(params).map(([key, value]) => [key, String(value)]),
		).toString()

		// Generate query hash
		const alg = 'SHA512'
		const queryHash = CryptoJS.SHA512(query).toString()

		// Generate JWT token
		const payload = {
			access_key: accessKey,
			nonce: uuidv4(),
			timestamp: Date.now(),
			query_hash: queryHash,
			query_hash_alg: alg,
		}
		// JWT 생성 (브라우저 호환)
		const base64UrlEncode = (str: string) => {
			// UTF-8 인코딩 처리
			const utf8Bytes = new TextEncoder().encode(str)
			let binary = ''
			for (let i = 0; i < utf8Bytes.length; i++) {
				binary += String.fromCharCode(utf8Bytes[i])
			}
			return btoa(binary)
				.replace(/\+/g, '-')
				.replace(/\//g, '_')
				.replace(/=+$/, '')
		}
		const header = {
			alg: 'HS256',
			typ: 'JWT',
		}

		const headerEncoded = base64UrlEncode(JSON.stringify(header))
		const payloadEncoded = base64UrlEncode(JSON.stringify(payload))
		const signatureInput = `${headerEncoded}.${payloadEncoded}`

		// HMAC-SHA256 서명 생성
		const encoder = new TextEncoder()
		const keyData = encoder.encode(secretKey)
		const messageData = encoder.encode(signatureInput)

		// window.crypto.subtle 사용 (Web Crypto API)
		if (!window.crypto || !window.crypto.subtle) {
			throw new Error(
				'Web Crypto API is not available. Please use HTTPS or a secure context.',
			)
		}

		const cryptoKey = await window.crypto.subtle.importKey(
			'raw',
			keyData,
			{ name: 'HMAC', hash: 'SHA-256' },
			false,
			['sign'],
		)

		const signature = await window.crypto.subtle.sign(
			'HMAC',
			cryptoKey,
			messageData,
		)
		const signatureArray = Array.from(new Uint8Array(signature))

		// 바이너리 데이터를 base64url로 직접 변환
		let binaryString = ''
		for (let i = 0; i < signatureArray.length; i++) {
			binaryString += String.fromCharCode(signatureArray[i])
		}
		const signatureBase64 = btoa(binaryString)
			.replace(/\+/g, '-')
			.replace(/\//g, '_')
			.replace(/=+$/, '')
		const signatureEncoded = signatureBase64

		const jwtToken = `${signatureInput}.${signatureEncoded}`
		const authorizationToken = `Bearer ${jwtToken}`

		// Set headers
		const config = {
			headers: {
				Authorization: authorizationToken,
				'Content-Type': 'application/json',
			},
		}

		buyTetherApi(params, config)
			.then(_ => {
				setIsBuy(true)
				// console.log('API Response:', response)
				// console.log('Response Data:', response.data)
			})
			.catch(error => {
				console.error('Error calling API:', error)
			})
	}

	useEffect(() => {
		coinListApi()
			.then(res => {
				const data: CoinList[] = res.data
				const converted = data.map(item => ({
					title: item.korean_name,
					value: item.korean_name,
					label: item.market,
				}))
				setData(converted)
			})
			.catch(err => {
				console.error(err)
			})
	}, [])

	const handleChange = (newValue: string) => {
		setRealBuyValue(newValue)
	}

	const handleSellChange = (newValue: string) => {
		setRealSellValue(newValue)
	}
	const justSearch = (_: string, option: any) => {
		setPriceCoinKeyValue(option.value)
		setPriceValue(option.label)
		setGetCoinPrice(0)
	}

	return (
		<Watermark content={['진섭제작']}>
			<div style={{ paddingLeft: 100, paddingTop: 20 }}>
				<div
					style={{ marginLeft: 200, fontSize: 18, fontWeight: 'bold' }}
				></div>
				<div style={{ paddingTop: 0 }}>
					<Flex gap={25}>
						<h1>※ 코인(원화마켓) 현재가</h1>
						<Select
							showSearch={true}
							optionFilterProp="children"
							filterOption={(input, option) => {
								const label = String(option?.label || '').toLowerCase()
								const value = String(option?.value || '').toLowerCase()
								const query = input.toLowerCase()

								return label.includes(query) || value.includes(query)
							}}
							value={priceValue}
							size="large"
							style={{ width: 150, marginTop: 4 }}
							placeholder={'검색할 코인'}
							defaultActiveFirstOption={false}
							suffixIcon={null}
							onChange={justSearch}
							notFoundContent={null}
							options={(data || []).map(d => ({
								value: d.label,
								label: d.value,
							}))}
						/>
						<div>
							<Button
								type="primary"
								size="large"
								style={{ marginTop: 3, width: 100 }}
								onClick={handleCoinPrice}
							>
								조회
							</Button>
						</div>
						{getCoinPrice > 0 && (
							<div>
								<h1>
									{' '}
									👉 {priceValue} 현재가: {getCoinPrice.toLocaleString()}원
								</h1>
							</div>
						)}
					</Flex>
				</div>
				<div style={{ marginTop: 50 }}>
					<Flex gap={25}>
						<h1>※ 코인(원화마켓) 거래하기</h1>
						{isBuy && (
							<div style={{ marginTop: 8 }}>
								<h3> 👉 구매 완! 자세한 내역은 빗썸 어플에서 확인하세요.</h3>
							</div>
						)}
					</Flex>
				</div>
				<Form
					name="basic"
					labelCol={{ span: 8 }}
					wrapperCol={{ span: 16 }}
					style={{ maxWidth: 300, marginTop: 20 }}
					initialValues={{ remember: true }}
					onFinish={values => handleByeCoin('buy', values)}
					autoComplete="off"
				>
					<Form.Item<FieldType>
						label="거래할코인"
						name="coinName"
						rules={[{ required: true }]}
					>
						<Select
							showSearch={true}
							value={realBuyValue}
							optionFilterProp="children"
							filterOption={(input, option) => {
								const label = String(option?.label || '').toLowerCase()
								const value = String(option?.value || '').toLowerCase()
								const query = input.toLowerCase()

								return label.includes(query) || value.includes(query)
							}}
							placeholder={'거래할 코인을 선택하세요'}
							defaultActiveFirstOption={false}
							suffixIcon={null}
							onChange={handleChange}
							notFoundContent={null}
							options={(data || []).map(d => ({
								value: d.label,
								label: d.value,
							}))}
						/>
					</Form.Item>
					<Form.Item<FieldType>
						label="거래수량"
						name="volume"
						rules={[{ required: true }]}
					>
						<Input />
					</Form.Item>
					<Form.Item<FieldType>
						label="주문가격"
						name="price"
						rules={[{ required: true }]}
					>
						<Input />
					</Form.Item>
					<Form.Item<FieldType>
						label="API KEY"
						name="apiKey"
						rules={[{ required: true }]}
					>
						<Input />
					</Form.Item>
					<Form.Item<FieldType>
						label="SECRET KEY"
						name="secretKey"
						rules={[{ required: true }]}
					>
						<Input />
					</Form.Item>
					<Form.Item label={null}>
						<Button type="primary" htmlType="submit" style={{ width: 200 }}>
							구매
						</Button>
					</Form.Item>
				</Form>
				<div style={{ marginTop: 50 }}>
					<Flex gap={25}>
						<h1>※ 코인(원화마켓) 판매하기</h1>
						{isBuy && (
							<div style={{ marginTop: 8 }}>
								<h3> 👉 판매 완! 자세한 내역은 빗썸 어플에서 확인하세요.</h3>
							</div>
						)}
					</Flex>
				</div>
				<Form
					name="basic"
					labelCol={{ span: 8 }}
					wrapperCol={{ span: 16 }}
					style={{ maxWidth: 300, marginTop: 20 }}
					initialValues={{ remember: true }}
					onFinish={values => handleByeCoin('sell', values)}
					autoComplete="off"
				>
					<Form.Item<FieldType>
						label="거래할코인"
						name="coinName"
						rules={[{ required: true }]}
					>
						<Select
							showSearch={true}
							value={realBuyValue}
							optionFilterProp="children"
							filterOption={(input, option) => {
								const label = String(option?.label || '').toLowerCase()
								const value = String(option?.value || '').toLowerCase()
								const query = input.toLowerCase()

								return label.includes(query) || value.includes(query)
							}}
							placeholder={'거래할 코인을 선택하세요'}
							defaultActiveFirstOption={false}
							suffixIcon={null}
							onChange={handleSellChange}
							notFoundContent={null}
							options={(data || []).map(d => ({
								value: d.label,
								label: d.value,
							}))}
						/>
					</Form.Item>
					<Form.Item<FieldType>
						label="거래수량"
						name="volume"
						rules={[{ required: true }]}
					>
						<Input />
					</Form.Item>
					<Form.Item<FieldType>
						label="주문가격"
						name="price"
						rules={[{ required: true }]}
					>
						<Input />
					</Form.Item>
					<Form.Item<FieldType>
						label="API KEY"
						name="apiKey"
						rules={[{ required: true }]}
					>
						<Input />
					</Form.Item>
					<Form.Item<FieldType>
						label="SECRET KEY"
						name="secretKey"
						rules={[{ required: true }]}
					>
						<Input />
					</Form.Item>
					<Form.Item label={null}>
						<Button type="primary" htmlType="submit" style={{ width: 200 }}>
							구매
						</Button>
					</Form.Item>
				</Form>
			</div>
		</Watermark>
	)
}
