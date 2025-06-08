// components/ui/myPage/ReviewPreview.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function ReviewPreview({ reviews = [], isFull = false, onItemClick }) {
  const navigate = useNavigate();
  const displayList = isFull ? reviews : reviews.slice(0, 4);
  const { t } = useTranslation();

  return (
    <section className="mb-12 pb-8">
      {!isFull && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">{t('reviewPreview.title')}</h3>
            <button
              onClick={() => navigate('/mypage/review-list')}
              className="text-sm text-blue-600 hover:underline"
            >
              {t('common.viewAll')}
            </button>
          </div>
          <div className="border-b-2 border-black mb-6" />
        </div>
      )}

      {reviews.length === 0 ? (
        <p className="text-gray-500 text-center mt-20">{t('reviewPreview.noReviews')}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayList.map((review, index) => (
            <div
              key={index}
              className="flex flex-col items-center border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onItemClick && onItemClick(review)}
            >
              {review.firstImageUrl ? (
                <img
                  src={review.firstImageUrl}
                  alt={review.placeName}
                  className="w-32 h-32 object-cover rounded mb-2"
                  onError={e => { e.target.onerror = null; e.target.src = '/default-image.png'; }}
                />
              ) : (
                <img
                  src={'/default-image.png'}
                  alt="no-img"
                  className="w-32 h-32 object-cover rounded mb-2"
                />
              )}
              <div className="flex items-center gap-2">
                <p className="font-medium text-center">{review.placeName}</p>
                <span role="img" aria-label="별">⭐</span>
                <span className="text-yellow-500 font-semibold">{review.rating ?? review.averageRating}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
