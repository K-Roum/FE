// /pages/MyPage/ReviewListPage.jsx
import React, { useEffect, useState } from 'react';
import MyPageLayout from './MyPageLayout';
import ReviewPreview from '../../components/ui/myPage/ReviewPreview';

export default function ReviewListPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

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
        <h1 className="text-2xl font-bold mb-2">작성한 리뷰</h1>
        <div className="border-b-2 border-black mb-8" />
        {loading ? (
          <p>불러오는 중...</p>
        ) : (
          <ReviewPreview reviews={reviews} isFull={true} />
        )}
      </div>
    </MyPageLayout>
  );
}
