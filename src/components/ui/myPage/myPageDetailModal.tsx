import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PlaceReview } from '../../../model/PlaceDetailModel'; // 경로 수정
import ReviewForm from '../searchPage/ReviewForm.tsx';

// 백엔드 DTO에 정의된 reviews와 bookmark 구조에 맞춰 인터페이스 정의
interface PlaceBookmarkDetail {
  bookmarkCount: number;
  bookmarked: boolean;
}

interface PlaceReviewsDetail {
  totalCount: number;
  averageRating: number;
  placesReviews: PlaceReview[];
}

// MyPageDetailModal에 전달될 item의 전체 구조
interface MyPageDetailModalItem {
  firstImageUrl: string;
  placeName: string;
  description: string;
  address: string;
  bookmarked: boolean; // 최상위 bookmarked (MyPage.jsx에서 전달받음)
  placeId: number;
  reviews: PlaceReviewsDetail; // 새로 추가된 리뷰 상세 정보
  bookmark: PlaceBookmarkDetail; // 새로 추가된 찜 상세 정보
}

type MyPageDetailModalProps = {
  isOpen: boolean;
  item: MyPageDetailModalItem | null; // MyPageDetailModalItem으로 타입 변경
  onClose: () => void;
};

// 날짜 포맷 함수 추가
function formatDateTime(dateString: string) {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

const MyPageDetailModal = ({ isOpen, item, onClose }: MyPageDetailModalProps) => {
  const { t, i18n } = useTranslation();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<{rating: number, content: string} | null>(null);
  const [reviews, setReviews] = useState(item?.reviews?.placesReviews || []);
  const [writeModalOpen, setWriteModalOpen] = useState(false);
  const [reviewsCount, setReviewsCount] = useState(item?.reviews?.totalCount || 0);
  const [averageRating, setAverageRating] = useState(item?.reviews?.averageRating || 0);

  useEffect(() => {
    if (item) {
      console.log("myPageDetailModal item:", item); // 디버깅 로그 유지
      setIsBookmarked(item.bookmarked ?? false);
      setBookmarkCount(item.bookmark?.bookmarkCount ?? 0);
      setReviews(item.reviews?.placesReviews || []);
      setReviewsCount(item.reviews?.totalCount || 0);
      setAverageRating(item.reviews?.averageRating || 0);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleBookmarkClick = async () => {
    try {
      const endpoint = `http://localhost:8080/bookmarks/${item.placeId}`;
      const method = isBookmarked ? 'DELETE' : 'POST';
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
        },
        credentials: 'include',
      });
      if (!response.ok) {
        console.error(`북마크 ${isBookmarked ? '취소' : '추가'} 실패:`, response.statusText);
        return;
      }
      const data = await response.json();
      setIsBookmarked(data.bookmarked);
      setBookmarkCount(data.bookmarkCount);
    } catch (error) {
      console.error('북마크 API 호출 중 오류 발생:', error);
    }
  };

  // 리뷰 편집 버튼 클릭
  const handleEditClick = (review: PlaceReview) => {
    setEditingReview({
      rating: review.rating,
      content: review.content,
    });
    setEditModalOpen(true);
  };

  // 리뷰 편집 제출
  const handleEditSubmit = async (form: {rating: number, comment: string}) => {
    if (!editingReview) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/reviews/${item.placeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          rating: form.rating,
          content: form.comment,
        }),
      });
      if (!res.ok) throw new Error('리뷰 수정 실패');
      // 리뷰 목록 갱신
      const updated = await res.json();
      setEditModalOpen(false);
      setEditingReview(null);
      setReviews(updated.placesReviews || []);
      setReviewsCount(updated.totalCount || (updated.placesReviews?.length ?? 0));
      setAverageRating(updated.averageRating || 0);
    } catch (err) {
      alert('리뷰 수정 중 오류 발생: ' + err.message);
    }
  };

  // 리뷰 편집 취소
  const handleEditCancel = () => {
    setEditModalOpen(false);
    setEditingReview(null);
  };

  // 리뷰 작성 버튼 클릭
  const handleWriteClick = () => {
    setWriteModalOpen(true);
  };

  // 리뷰 작성 제출
  const handleWriteSubmit = async (form: {rating: number, comment: string}) => {
    try {
      const token = localStorage.getItem('token');
      const lang = i18n.language || 'ko';
      const res = await fetch(`http://localhost:8080/reviews/${item.placeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          rating: form.rating,
          content: form.comment,
          languageCode: lang,
        }),
      });
      if (!res.ok) throw new Error('리뷰 등록 실패');
      const updated = await res.json();
      setWriteModalOpen(false);
      setReviews(updated.placesReviews || []);
      setReviewsCount(updated.totalCount || (updated.placesReviews?.length ?? 0));
      setAverageRating(updated.averageRating || 0);
    } catch (err) {
      alert('리뷰 등록 중 오류 발생: ' + err.message);
    }
  };

  // 리뷰 작성 취소
  const handleWriteCancel = () => {
    setWriteModalOpen(false);
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
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-lg rounded-t-xl">
              {t('common.noImage')}
            </div>
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
              {item.placeName}
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

          {/* 찜 및 리뷰 수 표시 추가 */}
          <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
            <div>❤️ {t('common.likes')} {bookmarkCount}</div>
            <div>📝 {t('common.reviews')} {reviewsCount}</div>
          </div>

          {/* 정보 카드 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-gray-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              
              <div>
                <span className="font-medium text-gray-700">{t('common.address')}</span>
                <p className="text-gray-600 text-sm mt-1">{item.address || t('common.noAddressInfo')}</p>
              </div>
            </div>
          </div>

          {/* 설명 */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3 text-gray-900">{t('common.details')}</h3>
            <p className="text-gray-600 leading-relaxed">
              {item.description || t('common.noDescriptionInfo')}
            </p>
          </div>

          {/* 리뷰 섹션 (간단하게 평균 평점만 표시) */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg mb-4 text-gray-900 flex items-center justify-between">
              {t('common.reviews')}
              <button
                onClick={handleWriteClick}
                className="ml-2 px-4 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-sm font-semibold transition-colors"
              >
                {t('reviewForm.submit')}
              </button>
            </h3>

            <div className="flex items-center text-gray-700 mb-4">
              <div className="text-yellow-500 mr-2 text-lg">⭐</div>
              <div className="text-sm">
                {t('common.averageRating')} <span className="font-semibold">{averageRating?.toFixed(1) ?? "?"}</span> / 5.0
              </div>
            </div>

            {reviews.map((review: PlaceReview, index: number) => (
              <div key={index} className="bg-gray-100 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium text-gray-800">{review.nickName || t('common.anonymousUser')}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{review.createdAt ? formatDateTime(review.createdAt) : t('common.noDateInfo')}</span>
                    <button
                      onClick={() => handleEditClick(review)}
                      className="text-gray-500 hover:text-blue-500 text-base font-bold p-1 rounded-full bg-white bg-opacity-75 hover:bg-opacity-100 transition-colors"
                      aria-label={t('common.edit')}
                    >
                      ✎
                    </button>
                  </div>
                </div>
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }, (_, starIndex) => (
                      <span
                        key={starIndex}
                        className={`text-xl ${starIndex < review.rating ? 'text-yellow-500' : 'text-gray-400'}`}
                      >
                        {starIndex < review.rating ? '★' : '☆'}
                      </span>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">({review.rating ?? '?'}/5)</span>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">{review.content || t('common.noContent')}</p>
              </div>
            ))}
            
            {reviews.length === 0 && (
              <p className="text-gray-500 text-center mt-4">{t('reviewPreview.noReviews')}</p>
            )}
          </div>
        </div>
      </div>
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-xl p-10 w-full max-w-2xl relative">
            <button
              onClick={handleEditCancel}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl font-bold p-1 rounded-full bg-white bg-opacity-75 hover:bg-opacity-100 transition-colors"
              aria-label="close"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">{t('리뷰 수정')}</h2>
            <ReviewForm
              isVisible={true}
              onSubmit={handleEditSubmit}
              onCancel={handleEditCancel}
              initialRating={editingReview?.rating}
              initialComment={editingReview?.content}
            />
          </div>
        </div>
      )}
      {writeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-xl p-10 w-full max-w-2xl relative">
            <button
              onClick={handleWriteCancel}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl font-bold p-1 rounded-full bg-white bg-opacity-75 hover:bg-opacity-100 transition-colors"
              aria-label="close"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">{t('reviewForm.submit')}</h2>
            <ReviewForm
              isVisible={true}
              onSubmit={handleWriteSubmit}
              onCancel={handleWriteCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPageDetailModal; 