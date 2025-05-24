// LanguageSelector.jsx
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

export default function LanguageSelector({ onSelect }) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'ko';

  const changeLang = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('lang', code);
    onSelect?.(); // 드롭다운 닫기 콜백
  };

  return (
    <ul className="text-sm text-gray-800 py-1">
      {Object.entries(LANGUAGES).map(([code, { label }]) => (
        <li
          key={code}
          onClick={() => changeLang(code)}
          className={`px-4 py-2 hover:bg-gray-100 cursor-pointer transition ${
            currentLang === code ? 'text-blue-600 font-semibold' : ''
          }`}
        >
          {label}
        </li>
      ))}
    </ul>
  );
}
