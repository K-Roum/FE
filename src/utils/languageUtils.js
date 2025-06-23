export const getLoginLogoPath = (language) => {
  const langMap = {
    ko: 'kroumLoginLogo.png',
    en: 'enLoginLogo.png',
    ja: 'jaLoginLogo.png',
    zh: 'zhLoginLogo.png',
    de: 'deLoginLogo.png',
    es: 'esLoginLogo.png',
    fr: 'frLoginLogo.png',
    ru: 'ruLoginLogo.png'
  };

  return `/assets/${langMap[language] || langMap.ko}`;
}; 