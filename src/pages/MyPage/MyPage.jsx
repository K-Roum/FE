// /pages/MyPage/MyPage.jsx
import React, { useEffect, useState } from 'react';
import MyPageLayout from './MyPageLayout';
import WishlistPreview from '../../components/ui/myPage/WishlistPreview';
import ReviewPreview from '../../components/ui/myPage/ReviewPreview';
import ProfileInfo from '../../components/ui/myPage/ProfileInfo';

export default function MyPage() {
  const [data, setData] = useState({
    profile: null,
    bookmarks: [],
    reviews: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyPage = async () => {
      try {
        const res = await fetch('http://localhost:8080/users/mypage', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            accept: '*/*',
          },
          credentials: 'include',
        });

        if (!res.ok) throw new Error('마이페이지 정보 조회 실패');

        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPage();
  }, []);

  return (
    <MyPageLayout>
      {loading ? (
        <p className="text-center">불러오는 중...</p>
      ) : (
        <>
          <WishlistPreview bookmarks={data.bookmarks} />
          <ReviewPreview reviews={data.reviews} />
          <ProfileInfo profile={data.profile} />
        </>
      )}
    </MyPageLayout>
  );
}
