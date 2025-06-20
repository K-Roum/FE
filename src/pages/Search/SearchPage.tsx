import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import SearchResultCard from "../../components/ui/searchPage/SearchResultCard.jsx";
import DetailModal from "../../components/ui/searchPage/DetailModal.tsx";
import MapComponent, { MapComponentRef } from "../../components/ui/searchPage/MapComponent.tsx";
import { SearchResultModel } from "../../model/SearchResultModel.ts";
import { PlaceDetailModel } from "../../model/PlaceDetailModel.ts";
import i18n from "../../i18n/index.js";
import { fetchPlaceDetail, toggleBookmark } from "../../services/SearchApi.ts";
import SearchSection from "../../components/ui/homePage/SearchSection.tsx";
// selectedItem 타입 정의
type SelectedItemType = {
  detail: PlaceDetailModel;
  summary: SearchResultModel;
} | null;

const SearchPage = () => {
  const location = useLocation();
  const { results }: { results: SearchResultModel[] } = location.state || {};
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SelectedItemType>(null);
  const [displayResults, setDisplayResults] = useState<SearchResultModel[]>(results || []);
  const [isShowingRecommendations, setIsShowingRecommendations] = useState(false);
  
  // MapComponent의 ref
  const mapRef = useRef<MapComponentRef>(null);

  const handleCardClick = async (item: SearchResultModel) => {
    const currentLang = i18n.language.toLowerCase();

    try {
      // 먼저 지도 중심을 클릭한 장소로 이동
      mapRef.current?.centerMapOnLocation(item.latitude, item.longitude);

      const parsedResponse = await fetchPlaceDetail(item.placeId, currentLang);

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
        mapRef.current?.updateMapMarkers(recommendationResults);
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
  
  const handleBookmarkClick = async (
    e: React.MouseEvent,
    item: SearchResultModel
  ) => {
    e.stopPropagation(); // 부모 클릭 방지

    try {
      await toggleBookmark(item.placeId, item.bookmarked);
      //성공일 때만 하도록 로직 변경
      const updatedResults = displayResults.map(result => 
    result.placeId === item.placeId 
      ? { ...result, bookmarked: !result.bookmarked }
      : result
  );
  setDisplayResults(updatedResults);
    } catch (error) {
      console.error("북마크 처리 중 오류:", error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* 지도 컴포넌트 */}
      <MapComponent ref={mapRef} results={displayResults} />

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
                  <SearchResultCard
                    item={item}
                    onCardClick={handleCardClick}
                    handleBookmarkClick={handleBookmarkClick} 
                  />
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
        handleBookmarkClick={handleBookmarkClick}
      />
    </div>
  );
};

export default SearchPage;