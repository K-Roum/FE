import React, { useState } from "react";
import { SearchResultModel } from "../../../model/SearchResultModel.ts";
import { useTranslation } from "react-i18next";

interface Props {
  item: SearchResultModel;
  isBookmarked: boolean;
  onCardClick: (item: SearchResultModel) => void;
  handleBookmarkClick: (e: React.MouseEvent, item: SearchResultModel) => void;
}

const SearchResultCard = ({
  item,
  isBookmarked,
  onCardClick,
  handleBookmarkClick,
}: Props) => {
  const { t } = useTranslation();
  const [imgLoading, setImgLoading] = useState(true);
  const handleCardClick = () => {
    onCardClick(item);
  };

  const onBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleBookmarkClick(e, item);
  };
  const handleImgLoad = () => {
    setImgLoading(false);
  };
  const handleImgError = () => {
    setImgLoading(false);
  };

  return (
    <div
      className="bg-white border rounded-lg shadow-md overflow-hidden h-40 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex flex-col md:flex-row h-full">
        {/* 이미지 */}
        <div className="w-full md:w-2/5 h-40 md:h-full relative">
          {item.firstImageUrl ? (
            <>
              {imgLoading && (
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center z-10">
                  <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
              )}

              <img
                src={item.firstImageUrl}
                alt={item.placeName}
                className={`w-full h-full object-cover ${
                  imgLoading ? "opacity-0" : "opacity-100"
                }`}
                onLoad={() => setImgLoading(false)}
                onError={() => setImgLoading(false)} // 실패해도 로딩 끝 처리
              />
            </>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">{t("noImage")}</span>
            </div>
          )}
        </div>

        {/* 정보 */}
        <div className="w-full md:w-3/5 p-4 flex flex-col">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-gray-800 truncate flex-1">
                {item.placeName || t("noTitle")}
              </h2>

              {/* 찜 버튼 */}
              <div className="flex space-x-2 ml-2">
                <button
                  onClick={onBookmarkClick}
                  className={`p-2 rounded-full hover:bg-gray-100 transition-colors
                    ${isBookmarked ? "text-red-500" : "text-gray-400"}
                    focus:outline-none focus:ring-0`}
                  aria-label={
                    isBookmarked ? t("removeBookmark") : t("addBookmark")
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    fill={isBookmarked ? "currentColor" : "none"}
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* 주소 */}
            <div className="flex items-start mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-500 mr-2 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p className="text-gray-500 text-sm line-clamp-1 mt-1">
                {item.address || t("noAddress")}
              </p>
            </div>
          </div>

          {/* 설명 줄임 */}
          <p className="text-gray-600 text-sm line-clamp-2 mt-1">
            {item.description || t("noDescription")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchResultCard;
