import React, { useState } from 'react';
import { PlaceDetailModel } from '../../../model/PlaceDetailModel';
import { SearchResultModel } from '../../../model/SearchResultModel';

type DetailModalProps = {
  isOpen: boolean;
  item: {
    detail: PlaceDetailModel | null; // null 허용으로 변경
    summary: SearchResultModel;
  } | null;
  onClose: () => void;
  isLoading?: boolean; // 로딩 상태 추가
};

const DetailModal = ({ isOpen, item, onClose, isLoading = false }: DetailModalProps) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  if (!isOpen || !item) return null;

  const { detail, summary } = item;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleBookmarkClick = () => {
    if (!isLoading) {
      setIsBookmarked(!isBookmarked);
    }
  };

  // 로딩 중이거나 detail이 없는 경우 로딩 화면 표시
  if (isLoading || !detail) {
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
        onClick={handleOverlayClick}
      >
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] shadow-2xl animate-slideUp">
          
          {/* 헤더 이미지 - 로딩 상태 */}
          <div className="relative h-64 bg-gradient-to-br from-blue-400 to-purple-600 rounded-t-xl">
            {summary.firstImageUrl ? (
              <img
                src={summary.firstImageUrl}
                alt={summary.placeName}
                className="w-full h-full object-cover rounded-t-xl"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-6xl" />
            )}

            {/* 로딩 오버레이 */}
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-t-xl">
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4"></div>
                <p className="text-lg font-medium">상세 정보 로딩 중...</p>
              </div>
            </div>

            {/* 닫기 버튼 */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200 hover:scale-110 z-10"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 로딩 중 기본 정보만 표시 */}
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold text-gray-900 flex-1">
                {summary.placeName}
              </h1>
              <button
                onClick={handleBookmarkClick}
                disabled={isLoading}
                className={`ml-4 p-2 rounded-full transition-colors focus:outline-none ${
                  isLoading 
                    ? "text-gray-300 cursor-not-allowed" 
                    : `hover:bg-gray-100 ${isBookmarked ? "text-red-500" : "text-gray-400"}`
                }`}
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

            {/* 주소 정보 */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-gray-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <span className="font-medium text-gray-700">주소</span>
                  <p className="text-gray-600 text-sm mt-1">{summary.address || "주소 정보 없음"}</p>
                </div>
              </div>
            </div>

            {/* 로딩 스켈레톤 */}
            <div className="space-y-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 데이터가 로드된 후 정상 화면 표시
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
        
        {/* 헤더 이미지 */}
        <div className="relative h-64 bg-gradient-to-br from-blue-400 to-purple-600 rounded-t-xl">
          {summary.firstImageUrl ? (
            <img
              src={summary.firstImageUrl}
              alt={summary.placeName}
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
              {summary.placeName}
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

          <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
            <div>❤️ 좋아요 {detail.details?.bookmark?.bookmarkCount || 0}</div>
            <div>📝 리뷰 {detail.details?.reviews?.totalCount || 0}</div>
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
                <p className="text-gray-600 text-sm mt-1">{summary.address || "주소 정보 없음"}</p>
              </div>
            </div>
          </div>

          {/* 설명 */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3 text-gray-900">상세 정보</h3>
            <p className="text-gray-600 leading-relaxed">
              {summary.description || "설명 정보가 없습니다."}
            </p>
          </div>

          {/* 리뷰 섹션 */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg mb-4 text-gray-900">리뷰</h3>

            {/* 평균 평점 */}
            <div className="flex items-center mb-4 text-gray-700">
              <div className="text-yellow-500 mr-2 text-lg">⭐</div>
              <div className="text-sm">
                평균 평점 <span className="font-semibold">{detail.details?.reviews?.averageRating?.toFixed(1) ?? "?"}</span> / 5.0
              </div>
            </div>

            {/* 리뷰 목록 */}
            <div className="space-y-4">
              {detail.details?.reviews?.placesReviews && detail.details.reviews.placesReviews.length > 0 ? (
                <>
                  {detail.details.reviews.placesReviews
                    .slice(0, showAllReviews ? detail.details.reviews.placesReviews.length : 3)
                    .map((review: any, index: number) => (
                      <div key={index} className="bg-gray-100 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium text-gray-800">{review.author || "익명 사용자"}</div>
                          <div className="text-sm text-gray-500">{review.date || "날짜 정보 없음"}</div>
                        </div>
                        <div className="flex items-center mb-2">
                          <div className="text-yellow-500 mr-2">⭐ {review.rating ?? "?"}/5</div>
                        </div>
                        <p className="text-gray-700 text-sm">{review.comment || "내용 없음"}</p>
                      </div>
                    ))}

                  {/* 더보기 버튼 */}
                  {detail.details.reviews.placesReviews.length > 3 && !showAllReviews && (
                    <button
                      onClick={() => setShowAllReviews(true)}
                      className="text-blue-600 text-sm mt-2 hover:underline focus:outline-none"
                    >
                      리뷰 더보기
                    </button>
                  )}
                </>
              ) : (
                <p className="text-gray-500 text-sm">등록된 리뷰가 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;