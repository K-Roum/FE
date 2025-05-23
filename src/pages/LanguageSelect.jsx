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

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-[1000px] h-[600px] flex items-center justify-center">
        <div className="bg-gray-200 rounded-xl shadow-md p-6 w-full max-w-xs">
          <p className="text-lg font-semibold text-center mb-4">
            {t('currentLanguage')} : {LANGUAGES[currentLang].label}
          </p>
          <hr className="mb-4 border-gray-400" />
          <ul className="space-y-3 text-center text-lg">
            {Object.entries(LANGUAGES).map(([code, { label, name }]) =>
              code !== currentLang ? (
                <li
                  key={code}
                  onClick={() => changeLang(code)}
                  className="cursor-pointer hover:text-blue-600 transition"
                >
                  {`${label} (${name})`}
                </li>
              ) : null
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelect;
