import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import LanguageDropdown from '../../components/common/LanguageDropdown';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'ko';
  const [showLangSelector, setShowLangSelector] = useState(false);
  const navigate = useNavigate();

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
      <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/home')}>
        <img
          src="/assets/kroumLogo.png"
          alt="Kroum Logo"
          className="h-10 w-auto object-contain"
        />
      </div>

      {/* 메뉴 */}
      <nav className="flex items-center space-x-6 text-gray-800 text-sm">
        <button onClick={() => navigate('/home')} className="hover:text-black-600">
          {t('search')}
        </button>
        <button onClick={() => navigate('/login')} className="hover:text-black-600">
          {t('login')}
        </button>
        <button className="hover:text-black-600">{t('signup')}</button>

        {/* 언어 선택 드롭다운 */}
        <div className="relative">
          <button
            onClick={() => setShowLangSelector(!showLangSelector)}
            className="flex items-center space-x-1 hover:text-black-600"
          >
            <Globe size={16} />
            <span>{LANGUAGES[currentLang].label}</span>
          </button>

          {showLangSelector && (
            <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <LanguageDropdown onSelect={() => setShowLangSelector(false)} />
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
