import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const FeaturedContent = ({ data }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const currentLang = i18n.language?.toLowerCase() || "ko";

  const handleImageClick = async (placeId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/places/${placeId}/with-everything-by-image?languageCode=${currentLang}`,
        { credentials: "include" }
      );
      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status}`);
      }

      const result = await response.json();

      const searchResultModel = {
        latitude: result.placeDto.latitude,
        longitude: result.placeDto.longitude,
        firstImageUrl: result.placeDto.firstImageUrl,
        placeName: result.placeDto.placeName,
        description: result.placeDto.description,
        address: result.placeDto.address,
        bookmarked: result.placeDto.bookmarked,
        placeId: result.placeDto.placeId,
      };

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
        {t('Loading recommended images...')}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
      {data.map((item, idx) => (
        <div
          key={item.id || idx}
          className="cursor-pointer transform transition-transform hover:scale-105"
          onClick={() => handleImageClick(item.placeId)}
        >
          <img
            src={item.image || item.imageUrl}
            alt={item.alt || item.title || t('Recommended Images')}
            className="w-full h-[363px] object-cover rounded-[30px]"
          />
          <div className="mt-2 text-center">
            <h3 className="text-xl font-medium">{item.title || ""}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedContent;
