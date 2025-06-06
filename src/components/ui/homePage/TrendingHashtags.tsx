import React from "react";
import { useTranslation } from "react-i18next";
import { hashtagKeys } from "../../../pages/Home/hooks/storage";
import { SearchResultModel } from "../../../model/SearchResultModel";
import { useNavigate } from "react-router-dom";

const getRandomItems = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const TrendingHashtags = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const randomKeys = getRandomItems(hashtagKeys, 6);
  const hashtags = randomKeys.map((key) => ({
    key,
    label: t(`hashtag.${key}`),
  }));

  const handleClick = async (hashtagKey) => {
    const currentLang = i18n.language;

    try {
      const response = await fetch('http://localhost:8080/places/search', 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },   body: JSON.stringify({
          query: `#${hashtagKey}`,
          languageCode: currentLang,
        }),
        }
      );
      console.log(response);

       if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: SearchResultModel[] = await response.json();
      navigate("/searchPage", {
        state: { query: hashtagKey, results: data },
      });
     
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <div className="flex justify-center mb-12">
      <div className="w-full max-w-[609px]">
        <div className="flex flex-wrap text-[24px] font-['LG_PC'] leading-[28px]">
          {hashtags.map(({ key, label }, index) => (
            <button
              key={index}
              className="mr-2 mb-2 hover:text-[#0050ff] transition-colors duration-200"
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
