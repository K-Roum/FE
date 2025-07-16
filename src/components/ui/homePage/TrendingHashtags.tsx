import React from "react";
import { useTranslation } from "react-i18next";
import { hashtagKeys } from "../../../pages/Home/hooks/storage";
import { SearchResultModel } from "../../../model/SearchResultModel";
import { useNavigate } from "react-router-dom";
import config from "../../../config";
import { performSearch } from "../../../services/SearchApi.ts";

const getRandomItems = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const TrendingHashtags = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const randomKeys = getRandomItems(hashtagKeys, 9);
  const hashtags = randomKeys.map((key) => ({
    key,
    label: t(`hashtag.${key}`),
  }));

  const handleClick = async (hashtagKey) => {
    const currentLang = i18n.language;
      const data = await performSearch(hashtagKey, currentLang);
      navigate("/searchPage", {
        state: { query: hashtagKey, results: data },
      });
  };

  return (
   <div className="flex justify-center mb-12">
  <div className="w-full flex justify-center">
    <div className="flex text-[28px] font-['LG_PC'] leading-[28px] whitespace-nowrap">
      {hashtags.map(({ key, label }, index) => (
        <button
          key={index}
          className="mr-2 hover:text-[#0050ff] transition-colors duration-200"
          onClick={() => handleClick(label)}
        >
          #{label}
        </button>
      ))}
    </div>
  </div>
</div>

  );
};

export default TrendingHashtags;
