// /pages/MyPage/ReviewListPage.jsx
import React, { useEffect, useState } from 'react';
import MyPageLayout from './MyPageLayout';
import { useTranslation } from 'react-i18next';

export default function ReviewListPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const fetchReviews = async () => {
    try {
      const res = await fetch('http://localhost:8080/reviews/detail', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
        },
        credentials: 'include',
      });

      if (!res.ok) throw new Error('리뷰 상세 조회 실패');

      const data = await res.json();
      setReviews(data || []);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDeleteReview = async (placeId) => {
    if (window.confirm(t('reviewListPage.confirmDelete'))) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:8080/reviews/${placeId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            accept: '*/*',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('리뷰 삭제 실패');
        }

        // 삭제 성공 후 리뷰 목록 새로고침
        fetchReviews();
      } catch (err) {
        console.error('리뷰 삭제 중 오류 발생:', err.message);
      }
    }
  };

  return (
    <MyPageLayout>
      <div className="w-full px-4 md:px-8 lg:px-12">
        <h1 className="text-2xl font-bold mb-2 text-left">{t('reviewListPage.title')}</h1>
        <div className="border-b-2 border-black mb-8 w-full" />
        {loading ? (
          <p>{t('common.loading')}</p>
        ) : (
          <div className="space-y-8">
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center mt-20">{t('reviewListPage.noReviews')}</p>
            ) : (
              reviews.map((review, index) => (
                <div key={index} className="border rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start relative">
                  <button
                    onClick={() => handleDeleteReview(review.placeId)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-lg font-bold p-1 rounded-full bg-white bg-opacity-75 hover:bg-opacity-100 transition-colors"
                    aria-label={t('common.delete')}
                  >
                    X
                  </button>
                  <div className="flex-shrink-0 w-80">
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
                        {[...Array(Math.floor(review.averageRating))].map((_, i) => (
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
                  <div className="flex-grow">
                    <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">{review.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </MyPageLayout>
  );
}
