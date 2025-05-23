import React from 'react';
import { useTranslation } from 'react-i18next';

const LandingPage = () => {
  const { t } = useTranslation();
//UI 개선
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="bg-white rounded-2xl shadow-2xl w-[1100px] h-[1000px] flex items-center justify-center">
        <button
          onClick={() => window.location.href = '/language'}
          className="px-24 py-8 text-4xl font-extrabold rounded-[48px] shadow-2xl text-white"
          style={{ background: 'linear-gradient(to right, red, black, blue)' }}
        >
          🌐 {t('language.select')}
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
