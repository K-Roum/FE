import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import LanguageSelector from '../../pages/LanguageSelect.jsx';

const Header = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'ko';
 
  const LANGUAGES = {
   ko: { label: '한국어' },
   en: { label: 'English' },
   zh: { label: '中文' },
   ja: { label: '日本語' },
   fr: { label: 'Français' },
   de: { label: 'Deutsch' },
   es: { label: 'Español' },
   ru: { label: 'Русский' },
  };

  return (
    <header className="flex items-center justify-between px-20 py-4 shadow-md">
      {/* 로고 */}
      <div className="flex items-center space-x-2">
        <img
          src="/assets/kroumLogo.png"
          alt="Kroum Logo"
          className="h-10 w-auto object-contain"
        />
      </div>

      {/* 메뉴 */}
      <nav className="flex items-center space-x-6 text-gray-800 text-sm">
        <button className="hover:text-black-600">{t('search')}</button>
        <button className="hover:text-black-600">{t('login')}</button>
        <button className="hover:text-black-600">{t('signup')}</button>
        <button className="hover:text-black-600">🌐{LANGUAGES[currentLang].label}</button>
      </nav>
    </header>
  );
};

export default Header;
