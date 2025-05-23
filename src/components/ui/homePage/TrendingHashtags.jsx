import React from 'react';
import { useTranslation } from 'react-i18next';

const TrendingHashtags = () => {
  const { t } = useTranslation();
  const hashtags = [
    t('tteokbokki'),
    t('kpop'),
    t('bts'),
    t('bibimbap'),
    t('amusementpark'),
    t('cherryblossom'),
  ];
  return (
    <div className="flex justify-center mb-12">
      <div className="w-full max-w-[609px]">
        <div className="flex flex-wrap text-[24px] font-['LG_PC'] leading-[28px]">
          {hashtags.map((tag, index) => (
            <button 
              key={index}
              className="mr-2 mb-2 hover:text-[#0050ff] transition-colors duration-200"
              onClick={() => console.log(`Clicked on #${tag}`)}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingHashtags;