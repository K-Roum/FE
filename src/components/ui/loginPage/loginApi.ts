// components/ui/loginPage/loginApi.ts

import config from "../../../config";

export interface LoginRequest {
    loginId: string;
    password: string;
  }
  
  export interface LoginResponse {
    success: boolean;
    message: string;
    sessionId?: string;
  }
  
  /**
   * 로그인 요청 함수
   * @param loginId - 사용자 로그인 ID
   * @param password - 사용자 비밀번호
   * @returns 로그인 성공 시 사용자 정보 반환, 실패 시 null
   */
  export async function loginUser({
    loginId,
    password,
  }: LoginRequest): Promise<LoginResponse | null> {
    try {
      const response = await fetch(`${config.apiBaseUrl}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // ✅ 세션 유지에 반드시 필요
        body: JSON.stringify({ loginId, password }),
      });
      const data = await response.json();


      // 기본적인 응답 형식 확인
      if (!data || typeof data !== 'object') {
        console.error('잘못된 응답 데이터:', data);
        return null;
      }

      // success 필드 확인
      if (data.success === undefined) {
        console.error('success 필드 누락:', data);
        return null;
      }

      // sessionId 추출 (메시지에서)
      let sessionId = '';
      if (data.success && data.message) {
        const match = data.message.match(/세션 ID: (.+)/);
        if (match) {
          sessionId = match[1];
        }
      }

      return {
        success: data.success,
        message: data.message || '',
        sessionId: sessionId
      };
    } catch (error) {
      console.error('로그인 요청 중 오류 발생:', error);
      return null;
    }
  }
  