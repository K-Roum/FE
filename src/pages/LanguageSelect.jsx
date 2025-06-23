import React from 'react';
import { useTranslation } from 'react-i18next';

const LANGUAGES = {
  ko: { label: '한국어', name: 'Korean' },
  en: { label: 'English', name: '영어' },
  zh: { label: '中文', name: '중국어' },
  ja: { label: '日本語', name: '일본어' },
  fr: { label: 'Français', name: '프랑스어' },
  de: { label: 'Deutsch', name: '독일어' },
  es: { label: 'Español', name: '스페인어' },
  ru: { label: 'Русский', name: '러시아어' },
};

const LanguageSelect = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'ko';

  const changeLang = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('lang', code);
    window.location.href = '/home';
  };
//UI 개선
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-2xl w-[1100px] h-[1000px] flex items-center justify-center">
        <div className="bg-gray-200 rounded-xl shadow-md p-8 w-full max-w-[400px]">
          <p className="text-2xl font-medium text-center mb-6">
            {t('currentLanguage')} : {LANGUAGES[currentLang]?.label || '한국어'}
          </p>
          <hr className="mb-6 border-gray-300" />
          <ul className="space-y-5 text-center text-lg">
            {Object.entries(LANGUAGES).map(([code, { label, name }]) => (
              <li
                key={code}
                onClick={() => changeLang(code)}
                className={`cursor-pointer transition py-1 flex items-center justify-center gap-2 ${
                  currentLang === code ? 'font-bold text-blue-600' : 'hover:text-blue-600'
                }`}
              >
                {label} ({name})
                {currentLang === code && <span className="ml-2">✓</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelect;
