// components/ui/myPage/ReviewPreview.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function ReviewPreview({ reviews = [], isFull = false, onItemClick }) {
  const navigate = useNavigate();
  const displayList = isFull ? reviews : reviews.slice(0, 5);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {displayList.map((review, index) => (
            <div
              key={index}
              className="flex flex-col items-center border rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onItemClick && onItemClick(review)}
            >
              <div className="w-full h-40 rounded-t-xl overflow-hidden">
                {review.firstImageUrl ? (
                  <img
                    src={review.firstImageUrl}
                    alt={review.placeName}
                    className="w-full h-full object-cover"
                    onError={e => { e.target.onerror = null; e.target.src = '/default-image.png'; }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-t-xl text-gray-400">
                    <span>{t('common.noImage')}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col w-full p-4">
                <p className="font-medium text-left flex-1 truncate text-lg">{review.placeName}</p>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(Math.floor(review.rating ?? review.averageRating))].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3 text-yellow-500"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.691h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.519 4.674c.3.921-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.519-4.674a1 1 0 00-.363-1.118L2.927 9.102c-.783-.57-.381-1.81.588-1.81h4.915a1 1 0 00.95-.691l1.519-4.674z"
                      />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
