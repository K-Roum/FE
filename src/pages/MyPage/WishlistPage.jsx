// /pages/MyPage/WishlistPage.jsx
import React, { useEffect, useState } from 'react';
import MyPageLayout from './MyPageLayout';
import WishlistPreview from '../../components/ui/myPage/WishlistPreview';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:8080/bookmarks', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            accept: '*/*',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('찜 목록 조회 실패');

        const data = await res.json();
        setWishlist(data || []);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  return (
    <MyPageLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">찜 목록</h1>
        <div className="border-b-2 border-black mb-8" />
        {loading ? (
          <p>불러오는 중...</p>
        ) : (
          <WishlistPreview bookmarks={wishlist} isFull={true} />
        )}
      </div>
    </MyPageLayout>
  );
}
