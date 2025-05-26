import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SearchResultCard from '../../components/ui/searchPage/SearchResultCard';
import DetailModal from '../../components/ui/searchPage/DetailModal';
import { SearchResultModel } from '../../model/SearchResultModel';
import { PlaceDetailModel } from '../../model/PlaceDetailModel.ts';
import i18n from '../../i18n';

// Declare kakao property on the Window interface
declare global {
  interface Window {
    kakao: any;
  }
}

const SearchPage = () => {
  const location = useLocation();
  const { results }: { results: SearchResultModel[] } = location.state || {};

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PlaceDetailModel | null>(null);

  useEffect(() => {
    console.log("useEffect 실행됨");

    const initMap = () => {
      const container = document.getElementById("map");

      const options = {
        center: new window.kakao.maps.LatLng(36, 127.5),
        level: 13,
      };

      const map = new window.kakao.maps.Map(container, options);

      if (results && results.length > 0) {
        results.forEach((item) => {
          const markerPosition = new window.kakao.maps.LatLng(item.latitude, item.longitude);

          const marker = new window.kakao.maps.Marker({
            position: markerPosition,
          });

          marker.setMap(map);
        });
      }
    };

    if (window.kakao && window.kakao.maps) {
      initMap();
      return;
    }

    const script = document.createElement("script");
    script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=c3600ddd05b590daebc467a042e53873&autoload=false";
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        initMap();
      });
    };

    script.onerror = (error) => {
      console.error("카카오맵 스크립트 로드 실패:", error);
    };

    document.head.appendChild(script);
  }, [results]);

  const handleCardClick = async (item: SearchResultModel) => {
    const currentLang = i18n.language.toLowerCase();

    try {
      const response = await fetch(`http://localhost:8080/places/${item.placeId}/with-everything?languageCode=${currentLang}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP 오류, 상태 코드: ${response.status}`);
      }

      const parsedResponse: PlaceDetailModel = await response.json();
      setSelectedItem(parsedResponse);
      setIsModalOpen(true);
    } catch (error) {
      console.error("장소 상세 정보 요청 실패:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="flex h-screen">
      {/* 지도 영역 */}
      <div className="w-1/2 bg-gray-100">
        <div id="map" style={{ width: '100%', height: '100%' }}></div>
      </div>

      {/* 검색 결과 리스트 */}
      <div className="w-1/2 p-8 overflow-y-auto">
        {results && results.length > 0 ? (
          <ul className="space-y-6">
            {results.map((item, index) => (
              <li key={index}>
                <SearchResultCard item={item} onCardClick={handleCardClick} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-500 text-lg">결과가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 상세 모달 */}
      <DetailModal isOpen={isModalOpen} item={selectedItem} onClose={handleCloseModal} />
    </div>
  );
};

export default SearchPage;
