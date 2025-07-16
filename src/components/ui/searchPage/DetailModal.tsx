import React, { useState, useEffect } from "react";
import { PlaceDetailModel } from "../../../model/PlaceDetailModel";
import { SearchResultModel } from "../../../model/SearchResultModel";
import ReviewForm from "./ReviewForm.tsx";
import { submitReview } from "../../../services/reviewApi.ts";
import { useTranslation } from 'react-i18next';

type DetailModalProps = {
  isOpen: boolean;
  item: {
    detail: PlaceDetailModel;
    summary: SearchResultModel;
  } | null;
  onClose: () => void;
  handleBookmarkClick: (e: React.MouseEvent, item: SearchResultModel) => Promise<void>;
};

const DetailModal = ({ isOpen, item, onClose, handleBookmarkClick }: DetailModalProps) => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.toLowerCase();

  const [isBookmarked, setIsBookmarked] = useState(item?.summary.bookmarked ?? false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    if (item) {
      setIsBookmarked(item.summary.bookmarked);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const { detail, summary } = item;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    await handleBookmarkClick(e, summary);
    setIsBookmarked((prev) => !prev);
    if (detail.details.bookmark) {
      detail.details.bookmark.bookmarkCount += isBookmarked ? -1 : 1;
    }
  };

  const handleReviewSubmit = async ({
    rating,
    comment,
  }: {
    rating: number;
    comment: string;
  }) => {
    try {
      const responseBody = await submitReview(summary.placeId, currentLang, rating, comment);
      item.detail.details.reviews = responseBody;
      setShowReviewForm(false);
      setShowAllReviews(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleReviewCancel = () => {
    setShowReviewForm(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-xl ${index < rating ? "text-yellow-500" : "text-gray-400"}`}
      >
        {index < rating ? "★" : "☆"}
      </span>
    ));
  };

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
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 본문 */}
        <div className="p-6">
          {/* 제목 & 찜 */}
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-gray-900 flex-1">{summary.placeName}</h1>
            <button
              onClick={handleBookmarkToggle}
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
            <div>❤️ {t('likes')} {detail.details.bookmark.bookmarkCount}</div>
            <div>📝 {t('reviews')} {detail.details.reviews.totalCount}</div>
          </div>

          {/* 정보 카드 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-gray-500 mr-3 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <div>
                <span className="font-medium text-gray-700">{t('address')}</span>
                <p className="text-gray-600 text-sm mt-1">{summary.address || t('no_address_info')}</p>
              </div>
            </div>
          </div>

          {/* 설명 */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3 text-gray-900">{t('detailed_info')}</h3>
            <div>
              <p
                className={`text-gray-600 leading-relaxed transition-all duration-300 ${
                  isDescriptionExpanded ? "" : "line-clamp-3"
                }`}
              >
                {summary.description || t('no_description')}
              </p>
              {summary.description && (
                <button
                  onClick={() => setIsDescriptionExpanded((prev) => !prev)}
                  className="text-blue-500 text-sm mt-1 hover:underline focus:outline-none"
                >
                  {isDescriptionExpanded ? t('collapse') : t('read_more')}
                </button>
              )}
            </div>
          </div>

          {/* 리뷰 */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg mb-4 text-gray-900">{t('reviews')}</h3>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-gray-700">
                <div className="text-yellow-500 mr-2 text-lg">⭐</div>
                <div className="text-sm">
                  {t('average_rating')}{" "}
                  <span className="font-semibold">
                    {detail.details.reviews.averageRating?.toFixed(1) ?? "?"}
                  </span>{" "}
                  / 5.0
                </div>
              </div>

              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                aria-label={t('write_review')}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            </div>

            {/* 리뷰 작성 폼 */}
            <ReviewForm
              isVisible={showReviewForm}
              onSubmit={handleReviewSubmit}
              onCancel={handleReviewCancel}
            />

            {/* 리뷰 목록 */}
            <div className="space-y-4">
              {detail.details.reviews.placesReviews &&
              detail.details.reviews.placesReviews.length > 0 ? (
                <>
                  {detail.details.reviews.placesReviews
                    .slice()
                    .reverse()
                    .slice(
                      0,
                      showAllReviews
                        ? detail.details.reviews.placesReviews.length
                        : 3
                    )
                    .map((review: any, index: number) => (
                      <div key={index} className="bg-gray-100 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium text-gray-800">
                            {review.nickName || t('anonymous_user')}
                          </div>
                          <div className="text-sm text-gray-500">
                            {review.createdAt
                              ? new Date(review.createdAt).toISOString().slice(0, 10)
                              : t('no_date_info')}
                          </div>
                        </div>
                        <div className="flex items-center mb-2">
                          <div className="flex items-center">
                            {renderStars(review.rating || 0)}
                            <span className="ml-2 text-sm text-gray-600">
                              ({review.rating ?? "?"}/5)
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm">
                          {review.content || t('no_content')}
                        </p>
                      </div>
                    ))}
                  {detail.details.reviews.placesReviews.length > 3 && !showAllReviews && (
                    <button
                      onClick={() => setShowAllReviews(true)}
                      className="text-black-600 text-sm mt-2 hover:underline focus:outline-none"
                    >
                      {t('load_more_reviews')}
                    </button>
                  )}
                </>
              ) : (
                <p className="text-gray-500 text-sm">{t('no_registered_reviews')}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
