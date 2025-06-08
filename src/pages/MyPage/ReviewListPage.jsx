// /pages/MyPage/ReviewListPage.jsx
import React, { useEffect, useState } from 'react';
import MyPageLayout from './MyPageLayout';
import { useTranslation } from 'react-i18next';

export default function ReviewListPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
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

    fetchReviews();
  }, []);

  return (
    <MyPageLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">{t('reviewListPage.title')}</h1>
        <div className="border-b-2 border-black mb-8" />
        {loading ? (
          <p>{t('common.loading')}</p>
        ) : (
          <div className="space-y-8">
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center mt-20">{t('reviewListPage.noReviews')}</p>
            ) : (
              reviews.map((review, index) => (
                <div key={index} className="border rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-shrink-0">
                    {review.firstImageUrl ? (
                      <img
                        src={review.firstImageUrl}
                        alt={review.placeName}
                        className="w-32 h-32 object-cover rounded"
                        onError={e => { e.target.onerror = null; e.target.src = '/default-image.png'; }}
                      />
                    ) : (
                      <img
                        src={'/default-image.png'}
                        alt="no-img"
                        className="w-32 h-32 object-cover rounded"
                      />
                    )}
                    <div className="flex items-center gap-2 mt-2 justify-center">
                      <p className="font-medium text-lg">{review.placeName}</p>
                      <span role="img" aria-label="별">⭐</span>
                      <span className="text-yellow-500 font-semibold text-lg">{review.averageRating}</span>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <p className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">{review.content}</p>
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
