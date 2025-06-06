// components/ui/myPage/ReviewPreview.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ReviewPreview({ reviews = [], isFull = false }) {
  const navigate = useNavigate();
  const displayList = isFull ? reviews : reviews.slice(0, 4);

  return (
    <section className="mb-12 pb-8">
      {!isFull && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">리뷰 목록</h3>
            <button
              onClick={() => navigate('/mypage/review-list')}
              className="text-sm text-blue-600 hover:underline"
            >
              전체 보기 &gt;
            </button>
          </div>
          <div className="border-b-2 border-black mb-6" />
        </div>
      )}

      {reviews.length === 0 ? (
        <p className="text-gray-500 text-center mt-20">리뷰 한 곳이 없어요.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayList.map((review, index) => (
            <div key={index} className="border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex gap-4">
              {review.firstImageUrl && (
                <img
                  src={review.firstImageUrl}
                  alt={review.placeName}
                  className="w-28 h-20 object-cover rounded"
                />
              )}
              <div className="flex flex-col justify-center">
                <p className="font-medium">{review.placeName}</p>
                <p className="text-sm text-gray-500">평균 평점: {review.averageRating}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
