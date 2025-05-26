import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { resetPasswordRequest } from '../../components/ui/loginPage/resetPasswordApi.ts';

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loginId, setLoginId] = useState('');
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleResetPassword = async () => {
    if (!loginId || !email) {
      setErrorMessage(t('resetPassword.errorEmpty'));
      setSuccessMessage('');
      return;
    }

    try {
      const ok = await resetPasswordRequest({ loginId, email });
      if (ok) {
        setSuccessMessage(t('resetPassword.success'));
        setErrorMessage('');
      } else {
        setErrorMessage(t('resetPassword.errorNotFound'));
        setSuccessMessage('');
      }
    } catch (e) {
      setErrorMessage(t('resetPassword.errorServer'));
      setSuccessMessage('');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* 좌측 로고 영역 */}
      <div className="w-[48%] flex flex-col items-center justify-center -mr-6">
        <img src="/assets/kroumLoginLogo.png" alt="K로움 로고" className="w-72 h-80 mb-4" />
      </div>

      {/* 우측 입력 영역 */}
      <div className="w-[52%] flex justify-center items-center -ml-6">
        <div className="w-full max-w-2xl bg-white p-14 rounded-3xl shadow-lg mx-8">
          <h2 className="text-2xl font-bold mb-8 text-center">{t('resetPassword.title')}</h2>

          <form
            onSubmit={(e) => {
                e.preventDefault();
                handleResetPassword();
            }}
            >
            <input 
                type="text"
                placeholder={t('resetPassword.idPlaceholder')}
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-400 rounded-md mb-4 placeholder-gray-400 focus:outline-none"
            />
            
            <input
                type="email"
                placeholder={t('resetPassword.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-400 rounded-md mb-4 placeholder-gray-400 focus:outline-none"
            />

            <button type="submit" className="w-full py-3 bg-gray-500 text-white font-semibold rounded-md">
                {t('resetPassword.resetButton')}
            </button>
        </form>

          {/* 성공 메시지 + 로그인 이동 */}
          {successMessage && (
            <>
              <div className="text-center mt-6 text-green-600 font-medium">{successMessage}</div>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-3 bg-gray-700 text-white rounded-md font-semibold hover:bg-gray-800"
                >
                  {t('resetPassword.goLogin')}
                </button>
              </div>
            </>
          )}

          {/* 에러 메시지 */}
          {errorMessage && (
            <div className="text-center mt-4 text-red-500 text-sm">{errorMessage}</div>
          )}
        </div>
      </div>
    </div>
  );
}
