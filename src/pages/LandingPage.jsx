import React from 'react';
import { useTranslation } from 'react-i18next';

const LandingPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="bg-white rounded-2xl shadow-2xl w-[1000px] h-[600px] flex items-center justify-center">
        <button
          onClick={() => window.location.href = '/language'}
          className="px-12 py-5 text-white text-xl font-semibold rounded-[30px] shadow-lg"
          style={{ background: 'linear-gradient(to right, red, black, blue)' }}
        >
          🌐 {t('language.select')}
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
