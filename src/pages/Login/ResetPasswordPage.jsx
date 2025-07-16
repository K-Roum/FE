import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { resetPasswordRequest } from '../../services/resetPasswordApi.ts';
import { getLoginLogoPath } from '../../utils/languageUtils';

export default function ResetPasswordPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [loginId, setLoginId] = useState('');
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 이메일 형식 검증
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 아이디 형식 검증 (영문, 숫자 조합 4~20자)
  const isValidId = (id) => {
    const idRegex = /^[A-Za-z0-9]{4,20}$/;
    return idRegex.test(id);
  };

  const handleResetPassword = async () => {
    // 중복 제출 방지
    if (isSubmitting) return;

    // 입력값 존재 여부 확인
    if (!loginId || !email) {
      setErrorMessage(t('resetPassword.errorEmpty'));
      setSuccessMessage('');
      return;
    }

    // 아이디 형식 검증
    if (!isValidId(loginId)) {
      setErrorMessage(t('resetPassword.errorInvalidId'));
      setSuccessMessage('');
      return;
    }

    // 이메일 형식 검증
    if (!isValidEmail(email)) {
      setErrorMessage(t('resetPassword.errorInvalidEmail'));
      setSuccessMessage('');
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await resetPasswordRequest({ loginId, email });
      
      if (result) {
        if (result.success && result.userVerified && result.emailSent) {
          setSuccessMessage(t('resetPassword.success'));
          setErrorMessage('');
          // 입력 필드 초기화
          setLoginId('');
          setEmail('');
        } else {
          // 실패 케이스별 메시지 처리
          let errorKey = 'resetPassword.errorServer';
          
          if (!result.userVerified) {
            errorKey = 'resetPassword.errorNotFound';
          } else if (!result.emailSent) {
            errorKey = 'resetPassword.errorEmailSend';
          }
          
          setErrorMessage(t(errorKey));
          setSuccessMessage('');
        }
      } else {
        setErrorMessage(t('resetPassword.errorServer'));
        setSuccessMessage('');
      }
    } catch (e) {
      setErrorMessage(t('resetPassword.errorServer'));
      setSuccessMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* 좌측 로고 영역 */}
      <div className="w-[48%] flex flex-col items-center justify-center -mr-6">
        <img 
          src={getLoginLogoPath(i18n.language)} 
          alt={t('common.logo')} 
          className="w-72 h-80 mb-4" 
        />
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
                disabled={isSubmitting}
                className="w-full px-4 py-3 border-2 border-gray-400 rounded-md mb-4 placeholder-gray-400 focus:outline-none disabled:bg-gray-100"
            />
            
            <input
                type="email"
                placeholder={t('resetPassword.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-3 border-2 border-gray-400 rounded-md mb-4 placeholder-gray-400 focus:outline-none disabled:bg-gray-100"
            />

            <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full py-3 text-white font-semibold rounded-md transition-colors ${
                  isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-500 hover:bg-gray-600'
                }`}
            >
                {isSubmitting ? t('resetPassword.submitting') : t('resetPassword.resetButton')}
            </button>
        </form>

          {/* 성공 메시지 + 로그인 이동 */}
          {successMessage && (
            <>
              <div className="text-center mt-6 text-green-600 font-medium" style={{ whiteSpace: 'pre-line' }}>{successMessage}</div>
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
