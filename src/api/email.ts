import emailjs from '@emailjs/browser'

/**
 * 트레이너에게 운동 일지 등록 알림 이메일 발송
 * EmailJS를 사용하여 클라이언트에서 직접 이메일 발송 (도메인 불필요)
 * @param trainerEmail 트레이너 이메일 주소
 * @param userName 회원 이름
 * @param workoutDate 운동 날짜
 * @param workoutTime 운동 시간
 * @returns 성공 여부
 */
export async function sendWorkoutLogEmail(
	trainerEmail: string,
	userName: string,
	workoutDate: string,
	workoutTime: string | null,
): Promise<boolean> {
	try {
		// EmailJS 설정
		const EMAILJS_SERVICE_ID = 'service_pdqwn06'
		const EMAILJS_TEMPLATE_ID = 'template_uip7z5m'
		const EMAILJS_PUBLIC_KEY = 'JcS8EU4RpK4915Z2r'

		if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
			console.error(
				'EmailJS 설정이 완료되지 않았습니다. 환경 변수를 확인해주세요.',
			)
			return false
		}

		// EmailJS 템플릿 파라미터
		// EmailJS 템플릿의 "To Email" 필드에 {{to_email}} 또는 {{reply_to}}를 사용해야 합니다
		const templateParams = {
			to_email: trainerEmail,
			reply_to: trainerEmail, // 일부 템플릿에서는 reply_to를 사용
			user_name: userName,
			workout_date: workoutDate,
			workout_time: workoutTime || '미기입',
		}

		console.log('EmailJS API 호출 데이터:', {
			service_id: EMAILJS_SERVICE_ID,
			template_id: EMAILJS_TEMPLATE_ID,
			to_email: trainerEmail,
			templateParams,
		})

		// EmailJS send 메서드 사용
		const response = await emailjs.send(
			EMAILJS_SERVICE_ID,
			EMAILJS_TEMPLATE_ID,
			templateParams,
			{
				publicKey: EMAILJS_PUBLIC_KEY,
			},
		)

		console.log('이메일 발송 성공:', response)
		return true
	} catch (error) {
		console.error('이메일 발송 중 오류 발생:', error)
		return false
	}
}
