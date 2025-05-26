import React, { useState } from 'react';

const DetailModal = ({ isOpen, item, onClose }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (!isOpen || !item) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleBookmarkClick = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
        
        {/* 헤더 이미지 */}
        <div className="relative h-64 bg-gradient-to-br from-blue-400 to-purple-600 rounded-t-xl">
          {item.firstImageUrl ? (
            <img
              src={item.firstImageUrl}
              alt={item.placeName}
              className="w-full h-full object-cover rounded-t-xl"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-6xl" />
          )}

          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200 hover:scale-110"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 본문 */}
        <div className="p-6">
          
          {/* 제목&찜 */}
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-gray-900 flex-1">
              {item.placeName || "제목 없음"}
            </h1>
            <button
              onClick={handleBookmarkClick}
              className={`ml-4 p-2 rounded-full hover:bg-gray-100 transition-colors
                ${isBookmarked ? "text-red-500" : "text-gray-400"} focus:outline-none`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7"
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

          {/* 정보 카드 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-gray-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <span className="font-medium text-gray-700">주소</span>
                <p className="text-gray-600 text-sm mt-1">{item.address || "주소 정보 없음"}</p>
              </div>
            </div>
          </div>

          {/* 설명 */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3 text-gray-900">상세 정보</h3>
            <p className="text-gray-600 leading-relaxed">
              {item.description || "설명 정보가 없습니다."}
            </p>
          </div>

          {/* 리뷰 섹션 (비워둠) */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg mb-4 text-gray-900">리뷰</h3>
            <div className="space-y-4">
              {/* 리뷰 내용은 나중에 작성 */}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
