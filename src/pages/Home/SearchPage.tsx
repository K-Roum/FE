import { useEffect, useState, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import SearchResultCard from "../../components/ui/searchPage/SearchResultCard";
import DetailModal from "../../components/ui/searchPage/DetailModal.tsx";
import { SearchResultModel } from "../../model/SearchResultModel";
import { PlaceDetailModel, Recommendation } from "../../model/PlaceDetailModel.ts";
import i18n from "../../i18n";

// Declare kakao property on the Window interface
declare global {
  interface Window {
    kakao: any;
  }
}


type SelectedItemType = {
  detail: PlaceDetailModel;
  summary: SearchResultModel;
} | null;

const SearchPage = () => {
  const location = useLocation();
  const { results }: { results: SearchResultModel[] } = location.state || {};

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SelectedItemType>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [displayResults, setDisplayResults] = useState<SearchResultModel[]>(results || []);
  const [isShowingRecommendations, setIsShowingRecommendations] = useState(false);
  

  const [isLoading, setIsLoading] = useState(false);
  

  const [detailCache, setDetailCache] = useState<Map<string, PlaceDetailModel>>(new Map());

  useEffect(() => {
    const initMap = () => {
      const container = document.getElementById("map");
      const options = {
        center: new window.kakao.maps.LatLng(36, 127.5),
        level: 13,
      };
      const map = new window.kakao.maps.Map(container, options);
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
  }, []);


  const updateMapMarkers = useCallback((items: SearchResultModel[]) => {
    if (!mapInstance || !items || items.length === 0) return;


    markers.forEach(marker => marker.setMap(null));


    const newMarkers = items.map((item) => {
      const markerPosition = new window.kakao.maps.LatLng(
        item.latitude,
        item.longitude
      );
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
      });
      marker.setMap(mapInstance);
      return marker;
    });
    
    setMarkers(newMarkers);
  }, [mapInstance, markers]);


  useEffect(() => {
    if (mapInstance && results && results.length > 0) {
      updateMapMarkers(results);
    }
  }, [mapInstance, results, updateMapMarkers]);


  const centerMapOnLocation = useCallback((latitude: number, longitude: number) => {
    if (mapInstance) {
      const moveLatLon = new window.kakao.maps.LatLng(latitude, longitude);
      mapInstance.setCenter(moveLatLon);
      mapInstance.setLevel(5);
    }
  }, [mapInstance]);


  const fetchPlaceDetail = useCallback(async (placeId: number, languageCode: string): Promise<PlaceDetailModel> => {

    const cacheKey = `${placeId}_${languageCode}`;
    if (detailCache.has(cacheKey)) {
      return detailCache.get(cacheKey)!;
    }


    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃

    try {
      const response = await fetch(
        `http://localhost:8080/places/${placeId}/with-everything?languageCode=${languageCode}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP 오류, 상태 코드: ${response.status}`);
      }

      const data: PlaceDetailModel = await response.json();
      

      setDetailCache(prev => new Map(prev).set(cacheKey, data));
      
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }, [detailCache]);

  const handleCardClick = useCallback(async (item: SearchResultModel) => {
    if (isLoading) return;
    
    setIsLoading(true);
    const currentLang = i18n.language.toLowerCase();

    try {

      centerMapOnLocation(item.latitude, item.longitude);
      setSelectedItem({
        detail: null as any, // 임시로 null 설정
        summary: item,
      });
      setIsModalOpen(true);

      const parsedResponse = await fetchPlaceDetail(item.placeId, currentLang);

      setSelectedItem({
        detail: parsedResponse,
        summary: item,
      });

      if (parsedResponse.recommendations && parsedResponse.recommendations.length > 0) {
        const recommendationResults = parsedResponse.recommendations.map(rec => rec.place);
        setDisplayResults(recommendationResults);
        setIsShowingRecommendations(true);
        setTimeout(() => {
          updateMapMarkers(recommendationResults);
        }, 0);
      }

    } catch (error) {
      console.error("장소 상세 정보 요청 실패:", error);
      setIsModalOpen(false);
      setSelectedItem(null);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, centerMapOnLocation, fetchPlaceDetail, updateMapMarkers]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedItem(null);
    
    if (isShowingRecommendations && results) {
      setDisplayResults(results);
      setIsShowingRecommendations(false);
      updateMapMarkers(results);
    }
  }, [isShowingRecommendations, results, updateMapMarkers]);

  const searchResultsList = useMemo(() => {
    if (!displayResults || displayResults.length === 0) {
      return (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-500 text-lg">결과가 없습니다.</p>
        </div>
      );
    }

    return (
      <>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {isShowingRecommendations ? "추천 장소" : "검색 결과"}
          </h2>
          {isLoading && (
            <div className="mt-2 text-sm text-blue-600">
              로딩 중...
            </div>
          )}
        </div>
        <ul className="space-y-6">
          {displayResults.map((item, index) => (
            <li key={`${item.placeId}-${index}`}>
              <SearchResultCard 
                item={item} 
                onCardClick={handleCardClick}
                disabled={isLoading} 
              />
            </li>
          ))}
        </ul>
      </>
    );
  }, [displayResults, isShowingRecommendations, isLoading, handleCardClick]);

  return (
    <div className="flex h-screen">
      {/* 지도 영역 */}
      <div className="w-1/2 bg-gray-100 relative">
        <div id="map" style={{ width: "100%", height: "100%" }}></div>
        {isLoading && (
          <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded-lg shadow-md">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-600">위치 정보 로딩 중...</span>
            </div>
          </div>
        )}
      </div>


      <div className="w-1/2 p-8 overflow-y-auto">        
        {searchResultsList}
      </div>


      <DetailModal
        isOpen={isModalOpen}
        item={selectedItem}
        onClose={handleCloseModal}
        isLoading={isLoading} 
      />
    </div>
  );
};

export default SearchPage;