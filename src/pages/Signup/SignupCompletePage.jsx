import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function SignupCompletePage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const lang = localStorage.getItem('lang') || 'ko';
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [i18n]);

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white px-4">
      <h1 className="text-8xl font-extrabold tracking-wide mb-10 font-[Jua] text-center">{t('signupComplete.title')}</h1>
      <hr className="w-96 border-gray-400 mb-8" />
      <p className="text-3xl text-gray-800 mb-14">{t('signupComplete.message')}</p>
      <button
        onClick={handleLoginRedirect}
        className="bg-gray-800 text-white w-96 py-4 text-xl rounded-md hover:bg-gray-700 transition"
      >
        {t('signupComplete.loginButton')}
      </button>
    </div>
  );
}