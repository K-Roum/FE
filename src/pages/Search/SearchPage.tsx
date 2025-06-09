import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SearchResultCard from "../../components/ui/searchPage/SearchResultCard.jsx";
import DetailModal from "../../components/ui/searchPage/DetailModal.tsx";
import { SearchResultModel } from "../../model/SearchResultModel.ts";
import { PlaceDetailModel, Recommendation } from "../../model/PlaceDetailModel.ts";
import i18n from "../../i18n/index.js";

// Declare kakao property on the Window interface
declare global {
  interface Window {
    kakao: any;
  }
}

// selectedItem 타입 정의 (detail + summary)
type SelectedItemType = {
  detail: PlaceDetailModel;
  summary: SearchResultModel;
} | null;

const SearchPage = () => {
  const location = useLocation();
  const { results }: { results: SearchResultModel[] } = location.state || {};
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SelectedItemType>(null);
  const [mapInstance, setMapInstance] = useState<any>(null); // 지도 인스턴스 상태 추가
  const [markers, setMarkers] = useState<any[]>([]); // 마커들을 관리하는 상태 추가
  const [displayResults, setDisplayResults] = useState<SearchResultModel[]>(results || []); // 현재 표시 중인 결과
  const [isShowingRecommendations, setIsShowingRecommendations] = useState(false); // 추천 장소 표시 여부

  useEffect(() => {
    const initMap = () => {
      const container = document.getElementById("map");
      const options = {
        center: new window.kakao.maps.LatLng(36, 127.5),
        level: 13,
      };
      const map = new window.kakao.maps.Map(container, options);
      
      // 지도 인스턴스를 상태에 저장
      setMapInstance(map);
    };

    if (window.kakao && window.kakao.maps) {
      initMap();
      return;
    }

    const script = document.createElement("script");
    script.src =
      "//dapi.kakao.com/v2/maps/sdk.js?appkey=c3600ddd05b590daebc467a042e53873&autoload=false";
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
  }, []); // 지도는 한 번만 초기화

  // 지도가 로드된 후 초기 마커들을 추가하는 별도 useEffect
  useEffect(() => {
    if (mapInstance && results && results.length > 0) {
      const newMarkers: any[] = [];
      results.forEach((item) => {
        const markerPosition = new window.kakao.maps.LatLng(
          item.latitude,
          item.longitude
        );
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(mapInstance);
        newMarkers.push(marker);
      });
      setMarkers(newMarkers);
    }
  }, [mapInstance, results]); // mapInstance가 생성된 후 실행

  // 기존 마커들을 제거하는 함수
  const clearMarkers = () => {
    markers.forEach(marker => {
      marker.setMap(null);
    });
    setMarkers([]);
  };

  // 지도 마커를 업데이트하는 함수
  const updateMapMarkers = (items: SearchResultModel[]) => {
    if (mapInstance && items && items.length > 0) {
      // 기존 마커들 제거
      clearMarkers();

      // 새로운 마커들 추가
      const newMarkers: any[] = [];
      items.forEach((item) => {
        const markerPosition = new window.kakao.maps.LatLng(
          item.latitude,
          item.longitude
        );
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(mapInstance);
        newMarkers.push(marker);
      });
      setMarkers(newMarkers);
    }
  };

  // Recommendation을 SearchResultModel 형태로 변환하는 함수
  const convertRecommendationToSearchResult = (recommendation: Recommendation): SearchResultModel => {
    return recommendation.place; 
  };

  // 지도 중심을 특정 위치로 이동시키는 함수
  const centerMapOnLocation = (latitude: number, longitude: number) => {
    if (mapInstance) {
      const moveLatLon = new window.kakao.maps.LatLng(latitude, longitude);
      mapInstance.setCenter(moveLatLon);
      mapInstance.setLevel(5); // 더 가까운 줌 레벨로 설정 (1-14, 숫자가 작을수록 확대)
    }
  };

  const handleCardClick = async (item: SearchResultModel) => {
    const currentLang = i18n.language.toLowerCase();

    try {
      // 먼저 지도 중심을 클릭한 장소로 이동
      centerMapOnLocation(item.latitude, item.longitude);

      const response = await fetch(
        `http://localhost:8080/places/${item.placeId}/with-everything?languageCode=${currentLang}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },credentials: 'include',
        }
      );
      const parsedResponse: PlaceDetailModel = await response.json();
      if (!response.ok) {
        throw new Error(`HTTP 오류, 상태 코드: ${response.status}`);
      }

      // detail과 summary를 객체로 묶어서 상태에 저장
      setSelectedItem({
        detail: parsedResponse,
        summary: item,
      });

      // 추천 장소 리스트로 변경
      if (parsedResponse.recommendations && parsedResponse.recommendations.length > 0) {
        const recommendationResults = parsedResponse.recommendations.map(rec => rec.place);
        setDisplayResults(recommendationResults);
        setIsShowingRecommendations(true);
        
        // 지도 마커 업데이트
        updateMapMarkers(recommendationResults);
      }

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
        <div id="map" style={{ width: "100%", height: "100%" }}></div>
      </div>

      {/* 검색 결과 리스트 */}
      <div className="w-1/2 p-8 overflow-y-auto">        
        {displayResults && displayResults.length > 0 ? (
          <>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {isShowingRecommendations ? "추천 장소" : "검색 결과"}
              </h2>
            </div>
            <ul className="space-y-6">
              {displayResults.map((item, index) => (
                <li key={index}>
                  <SearchResultCard item={item} onCardClick={handleCardClick} />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-500 text-lg">결과가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 상세 모달 */}
      <DetailModal
        isOpen={isModalOpen}
        item={selectedItem}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default SearchPage;