// components/ui/resetPasswordPage/resetPasswordApi.ts

import config from "../../../config";

export interface ResetPasswordRequest {
    loginId: string;
    email: string;
}

export interface ResetPasswordResponse {
    success: boolean;
    message: string;
    userVerified?: boolean;  // 사용자 검증 결과
    emailSent?: boolean;     // 이메일 전송 결과
}

/**
 * 비밀번호 재설정 요청 함수
 * @param loginId - 사용자 로그인 ID
 * @param email - 사용자 이메일
 * @returns 서버 응답 데이터, 실패 시 null
 */
export async function resetPasswordRequest({
    loginId,
    email,
}: ResetPasswordRequest): Promise<ResetPasswordResponse | null> {
    try {

        // 비밀번호 재설정 요청 (단일 엔드포인트로 변경)
        const response = await fetch(`${config.apiBaseUrl}users/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ 
                loginId: loginId.trim(),  // 공백 제거
                email: email.trim()       // 공백 제거
            }),
        });

        // 응답 텍스트 먼저 받기
        const responseText = await response.text();

        // 응답이 JSON이 아닌 경우 처리
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error('[비밀번호 재설정] JSON 파싱 오류:', e);
            return {
                success: false,
                message: '서버 응답을 처리할 수 없습니다.',
                userVerified: false,
                emailSent: false
            };
        }



        // 서버 응답 형식 검증
        if (!data || typeof data !== 'object') {
            console.error('[비밀번호 재설정] 잘못된 응답 형식:', data);
            return {
                success: false,
                message: '서버 응답 형식이 올바르지 않습니다.',
                userVerified: false,
                emailSent: false
            };
        }

        // 성공 응답
        if (response.ok && data.success) {
            return {
                success: true,
                message: data.message || '임시 비밀번호가 이메일로 전송되었습니다.',
                userVerified: true,
                emailSent: true
            };
        }

        // 실패 응답
        return {
            success: false,
            message: data.message || '비밀번호 재설정에 실패했습니다.',
            userVerified: false,
            emailSent: false
        };

    } catch (error) {
        console.error('[비밀번호 재설정] API 오류:', error);
        return {
            success: false,
            message: '서버와의 통신 중 오류가 발생했습니다.',
            userVerified: false,
            emailSent: false
        };
    }
}
  