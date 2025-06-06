import React from "react";
import { useTranslation } from "react-i18next";
import { hashtagKeys } from "../../../pages/Home/hooks/storage";

const getRandomItems = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const TrendingHashtags = () => {
  const { t } = useTranslation();

  const randomKeys = getRandomItems(hashtagKeys, 6);
  const hashtags = randomKeys.map((key) => t(`hashtag.${key}`));

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
