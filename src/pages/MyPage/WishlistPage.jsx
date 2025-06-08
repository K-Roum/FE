// /pages/MyPage/WishlistPage.jsx
import React, { useEffect, useState } from 'react';
import MyPageLayout from './MyPageLayout';
import WishlistPreview from '../../components/ui/myPage/WishlistPreview';
import { useTranslation } from 'react-i18next';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    console.log("WishlistPage useEffect 실행");
    const fetchBookmarks = async () => {
      console.log("fetchBookmarks 호출");
      try {
        const token = localStorage.getItem('token');
        console.log("fetch 요청 보냄");
        const res = await fetch('http://localhost:8080/bookmarks', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            accept: '*/*'
          },
          credentials: 'include'
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
        <h1 className="text-2xl font-bold mb-2">{t('wishlistPage.title')}</h1>
        <div className="border-b-2 border-black mb-8" />
        {loading ? (
          <p>{t('common.loading')}</p>
        ) : (
          <WishlistPreview bookmarks={wishlist} isFull={true} />
        )}
      </div>
    </MyPageLayout>
  );
}
