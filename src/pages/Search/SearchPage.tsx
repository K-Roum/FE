import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import SearchResultCard from "../../components/ui/searchPage/SearchResultCard.tsx";
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
  e.stopPropagation();

  try {
    await toggleBookmark(item.placeId, item.bookmarked);

    const updatedResults = displayResults.map((result) =>
      result.placeId === item.placeId
        ? { ...result, bookmarked: !result.bookmarked }
        : result
    );
    setDisplayResults(updatedResults);

    // 만약 상세 모달이 열려 있고 해당 item과 같다면 그것도 같이 반영
    if (selectedItem?.summary.placeId === item.placeId) {
      setSelectedItem((prev) =>
        prev
          ? {
              ...prev,
              summary: {
                ...prev.summary,
                bookmarked: !prev.summary.bookmarked,
              },
            }
          : null
      );
    }
  } catch (error) {
    console.error("북마크 처리 중 오류:", error);
  }
};

const handlePinClick = async (item: SearchResultModel) => {
  const currentLang = i18n.language.toLowerCase();

  try {
    // 지도 중심 이동
    mapRef.current?.centerMapOnLocation(item.latitude, item.longitude);

    // 장소 상세 API 호출
    const parsedResponse = await fetchPlaceDetail(item.placeId, currentLang);

    setSelectedItem({
      detail: parsedResponse,
      summary: item,
    });

    // 추천 장소 있으면 리스트 변경, 마커 업데이트
    if (parsedResponse.recommendations && parsedResponse.recommendations.length > 0) {
      const recommendationResults = parsedResponse.recommendations.map(rec => rec.place);
      setDisplayResults(recommendationResults);
      setIsShowingRecommendations(true);
      mapRef.current?.updateMapMarkers(recommendationResults);
    }

    setIsModalOpen(true);
  } catch (error) {
    console.error("장소 상세 정보 요청 실패:", error);
  }
};
 return (
  <div className="flex h-screen relative">
    {/* 지도 위에 올라갈 검색 바 */}
    <div className="absolute left-8 z-10 w-full max-w-[740px]">
      <SearchSection />
    </div>

    {/* 지도 컴포넌트 */}
    <MapComponent ref={mapRef} results={displayResults} onPinClick={handlePinClick} />

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
                  isBookmarked={item.bookmarked}
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