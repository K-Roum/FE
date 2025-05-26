import { loginUser } from '../../components/ui/loginPage/loginApi.ts';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';

export default function LoginPage() {

  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const { t, i18n } = useTranslation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginId || !password) {
      setErrorMessage('loginPage.errorEmpty');
      return;
    }

    const result = await loginUser({ loginId, password });

    if (result) {
      // 로컬스토리지 저장
      localStorage.setItem('token', result.token);
      localStorage.setItem('userId', result.userId);
      localStorage.setItem('nickname', result.nickname);
      localStorage.setItem('languageCode', result.languageCode);

      // 로그인 상태 유지 여부 저장
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }

      // 환영 메시지 및 이동
      alert(t('loginPage.success', { nickname: result.nickname }));
      navigate('/main');
    } else {
      setErrorMessage('loginPage.errorInvalid');
    }
  };

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') || 'ko';
    i18n.changeLanguage(savedLang);
  
    const remembered = localStorage.getItem('rememberMe');
    const token = localStorage.getItem('token');
  
    if (remembered === 'true' && token) {
      navigate('/main');
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* 좌측 로고 영역 */}
      <div className="w-[48%] flex flex-col items-center justify-center -mr-6">
        <img
          src="/assets/kroumLoginLogo.png"
          alt="K로움 로고"
          className="w-72 h-80 mb-4"
        />
      </div>

      {/* 우측 로그인 폼 영역 */}
      <div className="w-[52%] flex justify-center items-center -ml-6">
        <div className="w-full max-w-2xl bg-white p-14 rounded-3xl shadow-lg mx-8">
          <h3 className="text-3xl font-semibold mb-10">{t('loginPage.title')}</h3>

          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder={t('loginPage.idPlaceholder')}
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="w-full mb-6 px-5 py-4 text-lg border-2 border-gray-400 rounded-md placeholder-gray-400 focus:outline-none"
            />
            <input
              type="password"
              placeholder={t('loginPage.pwPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-4 px-5 py-4 text-lg border-2 border-gray-400 rounded-md placeholder-gray-400 focus:outline-none"
            />

            {/* 상태 유지 & 찾기 */}
            <div className="flex justify-between text-base text-gray-600 mb-8">
              <label>
                <input
                type="checkbox"
                className="mr-2 scale-110"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
                {t('loginPage.rememberMe')}
              </label>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/find-account'); // FindAccountPage 경로
                }}
                className="hover:underline cursor-pointer"
              >
                {t('loginPage.findAccount')}
              </a>
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              className="w-full py-4 mb-6 text-white font-bold rounded-md text-xl"
              style={{
                background: 'linear-gradient(to right, #D60000, #000000, #0038A8)',
              }}
            >
             {t('loginPage.loginButton')}
            </button>

            {/* 에러 메시지 시각적 표시 */}
            {errorMessage && (
              <div className="text-red-500 text-base mb-6 text-center">{t(errorMessage)}</div>
            )}

            {/* 구분선 */}
            <div className="text-center text-gray-400 mb-6 text-lg">or</div>

            {/* 회원가입 버튼 */}
            <button
              className="w-full py-4 border border-gray-300 text-gray-400 rounded-md cursor-not-allowed text-xl"
              disabled
            >
              {t('loginPage.signupButton')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
