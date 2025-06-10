import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { SearchResultModel } from "../../../model/SearchResultModel.ts";

// Declare kakao property on the Window interface
declare global {
  interface Window {
    kakao: any;
  }
}

// MapComponent가 외부에서 호출할 수 있는 메서드들의 타입 정의
export interface MapComponentRef {
  centerMapOnLocation: (latitude: number, longitude: number) => void;
  updateMapMarkers: (items: SearchResultModel[]) => void;
  clearMarkers: () => void;
}

interface MapComponentProps {
  results?: SearchResultModel[];
}

const MapComponent = forwardRef<MapComponentRef, MapComponentProps>(
  ({ results }, ref) => {
    const [mapInstance, setMapInstance] = useState<any>(null);
    const [markers, setMarkers] = useState<any[]>([]);

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

    // 카카오맵 스크립트 로드 및 지도 초기화
    useEffect(() => {
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

    // 지도가 로드된 후 초기 마커들을 추가하는 useEffect
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
    }, [mapInstance, results]);

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

    // 지도 중심을 특정 위치로 이동시키는 함수
    const centerMapOnLocation = (latitude: number, longitude: number) => {
      if (mapInstance) {
        const moveLatLon = new window.kakao.maps.LatLng(latitude, longitude);
        mapInstance.setCenter(moveLatLon);
        mapInstance.setLevel(5); // 더 가까운 줌 레벨로 설정 (1-14, 숫자가 작을수록 확대)
      }
    };

    // ref를 통해 외부에서 접근할 수 있는 메서드들을 노출
    useImperativeHandle(ref, () => ({
      centerMapOnLocation,
      updateMapMarkers,
      clearMarkers,
    }));

    return (
      <div className="w-1/2 bg-gray-100">
        <div id="map" style={{ width: "100%", height: "100%" }}></div>
      </div>
    );
  }
);

MapComponent.displayName = "MapComponent";

export default MapComponent;