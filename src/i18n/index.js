import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ko from '../locales/ko.json';
import en from '../locales/en.json';
import fr from '../locales/fr.json';
import zh from '../locales/zh.json';
import ja from '../locales/ja.json';
import de from '../locales/de.json';
import es from '../locales/es.json';
import ru from '../locales/ru.json';

const resources = {
  ko: { translation: ko },
  en: { translation: en },
  fr: { translation: fr },
  zh: { translation: zh },
  ja: { translation: ja },
  de: { translation: de },
  es: { translation: es },
  ru: { translation: ru },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('lang') || 'ko',
    fallbackLng: 'ko',
    interpolation: {
      escapeValue: false,
    },
  });

  const changeLang = (langCode) => {
    i18n.changeLanguage(langCode);                  // 언어 변경
    localStorage.setItem('lang', langCode);         // ✅ 로컬 저장소에 저장
  };

export default i18n;
