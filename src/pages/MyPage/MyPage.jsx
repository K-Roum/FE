// /pages/MyPage/MyPage.jsx
import React, { useEffect, useState } from 'react';
import MyPageLayout from './MyPageLayout';
import WishlistPreview from '../../components/ui/myPage/WishlistPreview';
import ReviewPreview from '../../components/ui/myPage/ReviewPreview';
import ProfileInfo from '../../components/ui/myPage/ProfileInfo';
import DetailModal from '../../components/ui/searchPage/DetailModal.tsx';
// import { SearchResultModel } from '../../model/SearchResultModel';
// import { PlaceDetailModel } from '../../model/PlaceDetailModel';
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
    const currentLang = i18n.language.toLowerCase();
    try {
      const response = await fetch(
        `http://localhost:8080/places/${item.placeId}/with-everything?languageCode=${currentLang}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            accept: '*/*',
          },
        }
      );
      const parsedResponse = await response.json();

      if (!response.ok) {
        throw new Error(`HTTP 오류, 상태 코드: ${response.status}`);
      }

      // DetailModal에 필요한 summary 데이터 구조 생성
      const summaryData = {
        placeId: parsedResponse.placeId,
        placeName: parsedResponse.placeName,
        firstImageUrl: parsedResponse.firstImageUrl || '', // 이미지 없으면 빈 문자열
        address: parsedResponse.details.address || '', // 주소 정보
        description: parsedResponse.details.description || '', // 설명 정보
        latitude: parsedResponse.latitude || 0,
        longitude: parsedResponse.longitude || 0,
      };

      setSelectedItem({
        detail: parsedResponse,
        summary: summaryData,
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error('장소 상세 정보 요청 실패:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <MyPageLayout>
      {loading ? (
        <p className="text-center">불러오는 중...</p>
      ) : (
        <>
          <WishlistPreview bookmarks={data.bookmarks} onItemClick={handleItemClick} />
          <ReviewPreview reviews={data.reviews} onItemClick={handleItemClick} />
          <ProfileInfo profile={data.profile} />
        </>
      )}

      {/* 상세 모달 */}
      <DetailModal
        isOpen={isModalOpen}
        item={selectedItem}
        onClose={handleCloseModal}
      />
    </MyPageLayout>
  );
}
