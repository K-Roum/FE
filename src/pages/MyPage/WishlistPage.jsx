// /pages/MyPage/WishlistPage.jsx
import React, { useEffect, useState } from 'react';
import MyPageLayout from './MyPageLayout';
import WishlistPreview from '../../components/ui/myPage/WishlistPreview';
import { useTranslation } from 'react-i18next';
import MyPageDetailModal from '../../components/ui/myPage/myPageDetailModal.tsx';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const token = localStorage.getItem('token');
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

  const handleItemClick = async (item) => {
    console.log('Clicked item:', item);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/users/${item.placeId}/details`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch details for place ID: ${item.placeId}`);
      }

      const parsedResponse = await res.json();
      console.log('API 응답:', parsedResponse);

      if (parsedResponse && parsedResponse.placeDetails) {
        const placeDetails = parsedResponse.placeDetails;
        setSelectedItem({
          placeId: parsedResponse.placeId,
          placeName: parsedResponse.placeName,
          address: parsedResponse.address,
          description: parsedResponse.description,
          imageUrl: parsedResponse.firstImageUrl,
          bookmark: placeDetails.bookmark,
          reviews: placeDetails.reviews,
          bookmarked: placeDetails.bookmark?.bookmarked ?? false,
        });
        setIsModalOpen(true);
      } else {
        console.error('API 응답에 placeDetails가 없습니다 또는 예상치 못한 구조입니다:', parsedResponse);
      }
    } catch (err) {
      console.error('Error fetching place details:', err);
      setSelectedItem(null);
      setIsModalOpen(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <MyPageLayout>
      <div className="w-full px-4 md:px-8 lg:px-12">
        <h1 className="text-2xl font-bold mb-2 text-left">{t('wishlistPage.title')}</h1>
        <div className="border-b-2 border-black mb-8 w-full" />
        {loading ? (
          <p>{t('common.loading')}</p>
        ) : (
          <WishlistPreview bookmarks={wishlist} isFull={true} onItemClick={handleItemClick} />
        )}
      </div>
      {isModalOpen && selectedItem && (
        <MyPageDetailModal
          isOpen={isModalOpen}
          item={selectedItem}
          onClose={handleCloseModal}
        />
      )}
    </MyPageLayout>
  );
}
