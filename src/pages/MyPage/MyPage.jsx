// /pages/MyPage/MyPage.jsx
import React, { useEffect, useState } from 'react';
import MyPageLayout from './MyPageLayout';
import WishlistPreview from '../../components/ui/myPage/WishlistPreview';
import ReviewPreview from '../../components/ui/myPage/ReviewPreview';
import ProfileInfo from '../../components/ui/myPage/ProfileInfo';
import MyPageDetailModal from '../../components/ui/myPage/myPageDetailModal.tsx';

import { useTranslation } from 'react-i18next';

export default function MyPage() {
  const [data, setData] = useState({
    profile: null,
    bookmarks: [],
    reviews: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { i18n, t } = useTranslation();

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

  // 아이템 클릭 핸들러 (찜 목록, 리뷰 목록 공통)
  const handleItemClick = async (item) => {
    try {
      const response = await fetch(
        `http://localhost:8080/users/${item.placeId}/details`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            accept: '*/*',
          },
          credentials: 'include',
        }
      );
      const parsedResponse = await response.json();
      console.log("API 원본 응답:", parsedResponse);

      if (!response.ok) {
        throw new Error(`HTTP 오류, 상태 코드: ${response.status}`);
      }

      // 백엔드 DTO에 따라 placeDetails 객체 접근
      const placeDetailsFromApi = parsedResponse.placeDetails;
      console.log("placeDetailsFromApi 객체:", placeDetailsFromApi);

      // placeDetails가 유효한지 확인
      if (!placeDetailsFromApi) {
        console.error('API 응답에 placeDetails 객체가 없습니다:', parsedResponse);
        return; // 함수 실행 중단
      }

      // MyPageDetailModal에 필요한 item 데이터 구조 생성 (새 API 응답 및 DTO에 맞춤)
      const itemForModal = {
        placeId: parsedResponse.placeId,
        placeName: parsedResponse.placeName,
        firstImageUrl: parsedResponse.firstImageUrl || '',
        address: parsedResponse.address || '',
        description: parsedResponse.description || '',
        bookmarked: parsedResponse.bookmarked,
        reviews: placeDetailsFromApi.reviews, // placeDetails 내부의 reviews 사용
        bookmark: placeDetailsFromApi.bookmark, // placeDetails 내부의 bookmark 사용
      };

      setSelectedItem(itemForModal);
      setIsModalOpen(true);
    } catch (error) {
      console.error('장소 상세 정보 요청 실패:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleBookmarkChange = (placeId, isBookmarked) => {
    setData(prev => ({
      ...prev,
      bookmarks: isBookmarked
        ? prev.bookmarks
        : prev.bookmarks.filter(b => b.placeId !== placeId)
    }));
  };

  return (
    <MyPageLayout>
      {loading ? (
        <p className="text-center">{t('common.loading')}</p>
      ) : (
        <>
          <WishlistPreview bookmarks={data.bookmarks} onItemClick={handleItemClick} />
          <ReviewPreview reviews={data.reviews} onItemClick={handleItemClick} />
          <ProfileInfo profile={data.profile} />
        </>
      )}

      {/* 상세 모달 */}
      <MyPageDetailModal
        isOpen={isModalOpen}
        item={selectedItem}
        onClose={handleCloseModal}
        onBookmarkChange={handleBookmarkChange}
      />
    </MyPageLayout>
  );
}
