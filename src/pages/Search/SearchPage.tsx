import { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SearchResultCard from "../../components/ui/searchPage/SearchResultCard.tsx";
import DetailModal from "../../components/ui/searchPage/DetailModal.tsx";
import MapComponent, { MapComponentRef } from "../../components/ui/searchPage/MapComponent.tsx";
import { SearchResultModel } from "../../model/SearchResultModel.ts";
import { PlaceDetailModel } from "../../model/PlaceDetailModel.ts";
import i18n from "../../i18n/index.js";
import { fetchPlaceDetail, toggleBookmark } from "../../services/SearchApi.ts";
import SearchSection from "../../components/ui/homePage/SearchSection.tsx";
import { useTranslation } from 'react-i18next';
type SelectedItemType = {
  detail: PlaceDetailModel;
  summary: SearchResultModel;
} | null;

const SearchPage = () => {
  const location = useLocation();

  const initialResults: SearchResultModel[] = location.state?.results || [];

  const [fetchedResults, setFetchedResults] = useState<SearchResultModel[]>(initialResults);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SelectedItemType>(null);
  const [isShowingRecommendations, setIsShowingRecommendations] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query") ?? "";

  const mapRef = useRef<MapComponentRef>(null);


  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) return;

      setLoading(true);
      try {
        const res = await fetch("http://localhost:8080/places/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
          credentials: "include",
          body: JSON.stringify({
            query: query,
            languageCode: i18n.language.toLowerCase(),
          }),
        });

        if (!res.ok) throw new Error("서버 오류");
        const data = await res.json();
        setFetchedResults(data);
        setIsShowingRecommendations(false); // 기본 검색 결과로 초기화
      } catch (err) {
        console.error("검색 실패:", err);
        setFetchedResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const handleCardClick = async (item: SearchResultModel) => {
    const currentLang = i18n.language.toLowerCase();

    try {
      mapRef.current?.centerMapOnLocation(item.latitude, item.longitude);

      const parsedResponse = await fetchPlaceDetail(item.placeId, currentLang);

      setSelectedItem({
        detail: parsedResponse,
        summary: item,
      });

      if (parsedResponse.recommendations && parsedResponse.recommendations.length > 0) {
        const recommendationResults = parsedResponse.recommendations.map((rec) => rec.place);
        setFetchedResults(recommendationResults);
        setIsShowingRecommendations(true);
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

  const handleBookmarkClick = async (e: React.MouseEvent, item: SearchResultModel) => {
    e.stopPropagation();

    try {
      await toggleBookmark(item.placeId, item.bookmarked);

      const updatedResults = fetchedResults.map((result) =>
        result.placeId === item.placeId
          ? { ...result, bookmarked: !result.bookmarked }
          : result
      );
      setFetchedResults(updatedResults);

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
      mapRef.current?.centerMapOnLocation(item.latitude, item.longitude);

      const parsedResponse = await fetchPlaceDetail(item.placeId, currentLang);

      setSelectedItem({
        detail: parsedResponse,
        summary: item,
      });

      if (parsedResponse.recommendations && parsedResponse.recommendations.length > 0) {
        const recommendationResults = parsedResponse.recommendations.map((rec) => rec.place);
        setFetchedResults(recommendationResults);
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
<div style={{ width: '50%', height: '600px', padding: '32px', overflowY: 'auto' }}>
  <MapComponent ref={mapRef} results={fetchedResults} onPinClick={handlePinClick} />
</div>

            {/* <MapComponent ref={mapRef} results={fetchedResults} onPinClick={handlePinClick} /> */}
      
      {/* </div> */}



      {/* 검색 결과 리스트 */}
      <div className="w-1/2 p-8 overflow-y-auto">
        {loading ? (
          <div className="text-center text-gray-600 mt-8">{t('Searching...')}</div>
        ) : fetchedResults.length > 0 ? (
          <>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {isShowingRecommendations ? t('Recommended Places') : t('Search Results')}
              </h2>
            </div>
            <ul className="space-y-6">
              {fetchedResults.map((item, index) => (
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
            <p className="text-gray-500 text-lg">{t('No Results')}</p>
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
