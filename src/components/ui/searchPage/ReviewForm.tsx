import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

type ReviewFormProps = {
  isVisible: boolean;
  onSubmit: (review: { rating: number; comment: string }) => void;
  onCancel: () => void;
  initialRating?: number;
  initialComment?: string;
};

const ReviewForm = ({ isVisible, onSubmit, onCancel, initialRating = 0, initialComment = '' }: ReviewFormProps) => {
  const { t } = useTranslation();
  const [review, setReview] = useState({
    rating: initialRating,
    comment: initialComment
  });

  useEffect(() => {
    setReview({ rating: initialRating, comment: initialComment });
  }, [initialRating, initialComment]);

  const renderStars = (rating: number, onStarClick: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        type="button"
        onClick={() => onStarClick(index + 1)}
        className={`text-xl cursor-pointer hover:scale-110 transition-all ${
          index < rating ? 'text-yellow-500' : 'text-gray-400'
        }`}
      >
        {index < rating ? '★' : '☆'}
      </button>
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (review.comment.trim()) {
      onSubmit(review);
      // 폼 초기화
      setReview({
        rating: 0,
        comment: ''
      });
    }
  };

  const handleCancel = () => {
    // 폼 초기화
    setReview({
      rating: 0,
      comment: ''
    });
    onCancel();
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gray-100 rounded-lg p-4 mb-4 border border-gray-300">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('reviewForm.rating')}</label>
          <div className="flex items-center space-x-1">
            {renderStars(review.rating, (rating) => 
              setReview(prev => ({ ...prev, rating }))
            )}
            <span className="ml-2 text-sm text-gray-600">
              ({review.rating}/5)
            </span>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('reviewForm.content')}</label>
          <textarea
            value={review.comment}
            onChange={(e) => setReview(prev => ({ ...prev, comment: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-sm resize-none"
            rows={3}
            placeholder={t('reviewForm.placeholder')}
            required
          />
        </div>
        
        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            {t('reviewForm.submit')}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm transition-colors focus:outline-none"
          >
            {t('reviewForm.cancel')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;