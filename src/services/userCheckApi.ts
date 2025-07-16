// src/api/userCheckApi.ts

import config from "../config";


const fetchWithConfig = async (url: string, options: RequestInit = {}) => {
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    mode: 'cors',
    credentials: 'include',
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export async function checkLoginId(loginId: string): Promise<boolean> {
    try {
      const response = await fetchWithConfig(`${config.apiBaseUrl}/users/check-loginId?loginId=${encodeURIComponent(loginId)}`, {
        method: 'GET',
        headers: {
          'Origin': 'http://localhost:3000'
        }
      });
      
      if (response.status === 200) {
        return true;
      } else if (response.status === 409) {
        return false;
      }
      return false;
    } catch (err) {
      console.error('Login ID check failed:', err);
      throw err;
    }
}
  
export async function checkEmail(email: string): Promise<boolean> {
    try {
      const response = await fetchWithConfig(`${config.apiBaseUrl}/users/check-email?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Origin': 'http://localhost:3000'
        }
      });
      
      if (response.status === 200) {
        return true;
      } else if (response.status === 409) {
        return false;
      }
      return false;
    } catch (err) {
      console.error('Email check failed:', err);
      throw err;
    }
}
  
export async function checkNickname(nickname: string): Promise<boolean> {
    try {
      const response = await fetchWithConfig(`${config.apiBaseUrl}/users/check-nickname?nickname=${encodeURIComponent(nickname)}`, {
        method: 'GET',
        headers: {
          'Origin': 'http://localhost:3000'
        }
      });
      
      if (response.status === 200) {
        return true;
      } else if (response.status === 409) {
        return false;
      }
      return false;
    } catch (err) {
      console.error('Nickname check failed:', err);
      throw err;
    }
}
  
export async function sendEmailCode(email: string): Promise<boolean> {
    try {
      const response = await fetch(`${config.apiBaseUrl}/email-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
        },
        body: JSON.stringify({ email }),
      });
  
      return response.ok; // 200이면 true
    } catch (err) {
      console.error('Error sending email code:', err);
      return false;
    }
  }
  
  export async function verifyEmailCode(email: string, code: string): Promise<boolean> {
    try {
      const response = await fetch(`${config.apiBaseUrl}/email-verification/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
        },
        body: JSON.stringify({ email, code }),
      });
  
      return response.ok; // 인증 성공 시 true
    } catch (err) {
      console.error('Error verifying email code:', err);
      return false;
    }
  }
  
export async function signupUser(userData: {
    loginId: string;
    password: string;
    email: string;
    nickname: string;
}): Promise<boolean> {
    try {
        const response = await fetch(`${config.apiBaseUrl}/users/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                loginId: userData.loginId,
                password: userData.password,
                email: userData.email,
                nickname: userData.nickname
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Signup failed:', errorData);
            throw new Error(errorData.message || '회원가입 처리 중 오류가 발생했습니다.');
        }

        return true;
    } catch (err) {
        console.error('Signup error details:', err);
        throw err;
    }
}  