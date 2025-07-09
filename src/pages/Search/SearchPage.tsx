import { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SearchResultCard from "../../components/ui/searchPage/SearchResultCard.tsx";
import DetailModal from "../../components/ui/searchPage/DetailModal.tsx";
import MapComponent, {
  MapComponentRef,
} from "../../components/ui/searchPage/MapComponent.tsx";
import { SearchResultModel } from "../../model/SearchResultModel.ts";
import { PlaceDetailModel } from "../../model/PlaceDetailModel.ts";
import {
  fetchPlaceDetail,
  toggleBookmark,
  performSearch,
} from "../../services/SearchApi.ts";
import SearchSection from "../../components/ui/homePage/SearchSection.tsx";
import { useTranslation } from "react-i18next";

type SelectedItemType = {
  detail: PlaceDetailModel;
  summary: SearchResultModel;
} | null;

const SearchPage = () => {
  const location = useLocation();
  const initialResults: SearchResultModel[] = location.state?.results || [];
  const [fetchedResults, setFetchedResults] =
    useState<SearchResultModel[]>(initialResults);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SelectedItemType>(null);
  const [isShowingRecommendations, setIsShowingRecommendations] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();

  const queryParams = new URLSearchParams(location.search);
  const query = location.state?.query ?? queryParams.get("query") ?? "";

  const mapRef = useRef<MapComponentRef>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchResults = async () => {
      const currentLang = i18n.language.toLowerCase();
      if (!query.trim()) return;

      // 초기 로딩 시 검색어가 있다면 해당 검색어로 결과를 가져옴
      //검색page에서 검색하는 경우

      if (location.state?.results) {
        const data = location.state.results;
        setFetchedResults(data);
        setIsShowingRecommendations(false);
        mapRef.current?.resetCenter();
        mapRef.current?.updateMapMarkers(data);
        return;
      }
      // 직접 API 호출
      setLoading(true);
      try {
        const data = await performSearch(query, currentLang);
        setFetchedResults(data || []);
        setIsShowingRecommendations(false);
        mapRef.current?.resetCenter(); // 검색 후 지도 중심 재설정
        mapRef.current?.updateMapMarkers(data || []);
      } catch (err) {
        console.error("검색 실패:", err);
        setFetchedResults([]);
        mapRef.current?.clearMarkers();
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query, location.state, i18n.language]);

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

  const handleCardClick = async (item: SearchResultModel) => {
    const currentLang = i18n.language.toLowerCase();

    try {
      mapRef.current?.centerMapOnLocation(item.latitude, item.longitude);

      const parsedResponse = await fetchPlaceDetail(item.placeId, currentLang);

      setSelectedItem({
        detail: parsedResponse,
        summary: item,
      });

      if (
        parsedResponse.recommendations &&
        parsedResponse.recommendations.length > 0
      ) {
        const recommendationResults = parsedResponse.recommendations.map(
          (rec) => rec.place
        );

        const filteredRecommendations = recommendationResults.filter(
          (place) => place.placeId !== item.placeId
        );
        const newResults = [item, ...filteredRecommendations];

        setFetchedResults(newResults);
        setIsShowingRecommendations(true);
        mapRef.current?.updateMapMarkers(newResults);
      }

      setIsModalOpen(true);
    } catch (error) {
      console.error("장소 상세 정보 요청 실패:", error);
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

      if (
        parsedResponse.recommendations &&
        parsedResponse.recommendations.length > 0
      ) {
        const recommendationResults = parsedResponse.recommendations.map(
          (rec) => rec.place
        );

        // 🛠️ 클릭한 장소를 맨 앞에 고정
        const filteredRecommendations = recommendationResults.filter(
          (place) => place.placeId !== item.placeId
        );
        const newResults = [item, ...filteredRecommendations];

        setFetchedResults(newResults);
        setIsShowingRecommendations(true);
        mapRef.current?.updateMapMarkers(newResults);
      }

      setIsModalOpen(true);
    } catch (error) {
      console.error("장소 상세 정보 요청 실패:", error);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [fetchedResults]);

  return (
    <div className="flex h-screen">
      {/* 지도 영역 */}
      <div className="relative" style={{ width: "50%", height: "100%" }}>
        {/* 지도 위에 올라갈 검색 바 */}
        <div className="absolute left-8 right-8 z-10 w-auto">
          <SearchSection />
        </div>
        <MapComponent
          ref={mapRef}
          results={fetchedResults}
          onPinClick={handlePinClick}
        />
      </div>

      {/* 검색 결과 리스트 */}
      <div ref={scrollRef} className="w-1/2 p-8 overflow-y-auto">
        {loading ? (
          <div className="text-center text-gray-600 mt-8">
            {t("Searching...")}
          </div>
        ) : fetchedResults.length > 0 ? (
          <>
            {isShowingRecommendations ? (
              <>
                {/* 선택 장소 */}
                <div className="mb-2">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {t("Selected Place")}
                  </h2>
                </div>
                <ul className="space-y-6 mb-8">
                  <li key={"selected"}>
                    <SearchResultCard
                      item={fetchedResults[0]}
                      onCardClick={handleCardClick}
                      isBookmarked={fetchedResults[0].bookmarked}
                      handleBookmarkClick={handleBookmarkClick}
                    />
                  </li>
                </ul>

                {/* 추천 장소 */}
                <div className="mb-2">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {t("Recommended Places")}
                  </h2>
                </div>
                <ul className="space-y-6">
                  {fetchedResults.slice(1).map((item, index) => (
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
              <>
                {/* 일반 검색 결과 */}
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {t("Search Results")}
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
            )}
          </>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-500 text-lg">{t("No Results")}</p>
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
