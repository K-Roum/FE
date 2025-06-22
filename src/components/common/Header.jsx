import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, User } from 'lucide-react';
import LanguageDropdown from '../../components/common/LanguageDropdown';
import { useNavigate, useLocation } from 'react-router-dom';

// 로그인 상태 관리를 위한 커스텀 이벤트
export const loginStatusChange = new Event('loginStatusChange');

const Header = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'ko';
  const [showLangSelector, setShowLangSelector] = useState(false);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

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
  
  // 언어별 로고 파일 매핑
  const LOGO_MAP = {
    ko: '/assets/kroumLogo.png',
    en: '/assets/enLogo.png',
    ja: '/assets/jaLogo.png',
    zh: '/assets/zhLogo.png',
    fr: '/assets/frLogo.png',
    de: '/assets/deLogo.png',
    es: '/assets/esLogo.png',
    ru: '/assets/ruLogo.png',
  };
  
  // 로그인 상태 확인 함수
  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    // 초기 로그인 상태 확인
    checkLoginStatus();

    // 로그인 상태 변경 이벤트 리스너
    const handleLoginChange = () => {
      checkLoginStatus();
    };

    // storage 이벤트 (다른 탭/창에서의 변경 감지)
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        checkLoginStatus();
      }
    };

    window.addEventListener('loginStatusChange', handleLoginChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('loginStatusChange', handleLoginChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // location 변경 감지
  useEffect(() => {
    checkLoginStatus();
  }, [location]);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8080/users/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
        },
        credentials: 'include',
      });
    } catch (e) {
      // 서버 에러 등 무시하고 클라이언트 상태만 정리
    }
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('nickname');
    localStorage.removeItem('languageCode');
    localStorage.removeItem('sessionId');
    localStorage.removeItem('rememberMe');
    setIsLoggedIn(false);
    window.dispatchEvent(loginStatusChange);
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between px-20 py-4 shadow-md">
      {/* 로고 */}
      <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/home')}>
        <img
          src={LOGO_MAP[currentLang] || '/assets/kroumLogo.png'}
          alt="Kroum Logo"
          className="h-10 w-auto object-contain"
        />
      </div>

      {/* 메뉴 */}
      <nav className="flex items-center space-x-6 text-gray-800 text-sm">
        <button onClick={() => navigate('/home')} className="hover:text-black-600">
          {t('search')}
        </button>

      {isLoggedIn ? (
        <>
          <button onClick={handleLogout} className="hover:text-black-600">
            {t('logout')}
          </button>
          <button onClick={() => navigate('/mypage')} className="hover:text-black-600 flex items-center space-x-1">
            <User size={16} />
            <span>MY</span>
          </button>
        </>
      ) : (
        <>
          <button onClick={() => navigate('/login')} className="hover:text-black-600">
            {t('login')}
          </button>
          <button onClick={() => navigate('/signup')} className="hover:text-black-600">
            {t('signup')}
          </button>
        </>
      )}

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

