import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { imageSearch } from "../../../services/SearchApi.ts"; // Assuming this is the correct path to your imageSearch function
import pick from "lodash/pick";

const FeaturedContent = ({ data }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const currentLang = i18n.language?.toLowerCase() || "ko";

  const handleImageClick = async (placeId) => {
    try {
      const result = await imageSearch(placeId, currentLang);
      const searchResultModel = pick(result.placeDto, [
        "address",
        "bookmarked",
        "description",
        "firstImageUrl",
        "latitude",
        "longitude",
        "placeName",
        "placeId",
      ]);

      navigate("/searchPage", {
        state: { results: [searchResultModel] },
      });
    } catch (error) {
      console.error("상세 정보 불러오기 실패:", error);
    }
  };

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-center text-gray-400 py-12">
        {t("Loading recommended images...")}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-12 mt-6 sm:mt-8">
      {data.map((item, idx) => (
        <div
          key={item.id || idx}
          className="cursor-pointer transform transition-transform hover:scale-105"
          onClick={() => handleImageClick(item.placeId)}
        >
          <img
            src={item.image || item.imageUrl}
            alt={item.alt || item.title || t("Recommended Images")}
            className="
              w-full
              h-[246.4px]       
              sm:h-[281.6px]    
              md:h-[316.8px]    
              lg:h-[399.3px]     
              object-cover
              rounded-[20px]
              sm:rounded-[24px]
              md:rounded-[28px]
              lg:rounded-[30px]
              transition-all
            "
          />
          <div className="mt-2 text-center">
            <h3 className="text-base sm:text-lg md:text-xl font-medium">
              {item.title || ""}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedContent;
