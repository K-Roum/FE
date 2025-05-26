// components/ui/loginPage/loginApi.js

/**
 * 로그인 요청 함수
 * @param {string} loginId - 사용자 로그인 ID
 * @param {string} password - 사용자 비밀번호
 * @returns {object|null} 로그인 성공 시 사용자 정보 반환, 실패 시 null
 */
export async function loginUser({ loginId, password }) {
    try {
      const response = await fetch('http://localhost:8080/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ loginId, password }),
      });
  
      if (!response.ok) {
        console.error(`로그인 실패 (status: ${response.status})`);
        return null;
      }
  
      const data = await response.json();
  
      // 예시: 필요한 사용자 정보 저장
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('nickname', data.nickname);
      localStorage.setItem('languageCode', data.languageCode);
  
      return data;
    } catch (error) {
      console.error('로그인 요청 중 오류 발생:', error);
      return null;
    }
  }
  