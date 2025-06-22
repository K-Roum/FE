import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { SearchResultModel } from "../../../model/SearchResultModel.ts";

declare global {
  interface Window {
    kakao: any;
  }
}

export interface MapComponentRef {
  centerMapOnLocation: (latitude: number, longitude: number) => void;
  updateMapMarkers: (items: SearchResultModel[]) => void;
  clearMarkers: () => void;
}

interface MapComponentProps {
  results?: SearchResultModel[];
  onPinClick?: (item: SearchResultModel) => void;
}

const MapComponent = forwardRef<MapComponentRef, MapComponentProps>(
  ({ results, onPinClick }, ref) => {
    const [mapInstance, setMapInstance] = useState<any>(null);
    const [markers, setMarkers] = useState<any[]>([]);

    const initMap = () => {
      const container = document.getElementById("map");
      const options = {
        center: new window.kakao.maps.LatLng(36, 127.5),
        level: 13,
      };
      const map = new window.kakao.maps.Map(container, options);
      setMapInstance(map);
    };

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

    // 초기 마커 로딩
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

          if (onPinClick) {
            window.kakao.maps.event.addListener(marker, "click", () => {
              onPinClick(item);
            });
          }

          marker.setMap(mapInstance);
          newMarkers.push(marker);
        });
        setMarkers(newMarkers);
      }
    }, [mapInstance, results, onPinClick]);

    const clearMarkers = () => {
      markers.forEach(marker => {
        marker.setMap(null);
      });
      setMarkers([]);
    };

    const updateMapMarkers = (items: SearchResultModel[]) => {
      if (mapInstance && items && items.length > 0) {
        clearMarkers();

        const newMarkers: any[] = [];
        items.forEach((item) => {
          const markerPosition = new window.kakao.maps.LatLng(
            item.latitude,
            item.longitude
          );
          const marker = new window.kakao.maps.Marker({
            position: markerPosition,
          });


          if (onPinClick) {
            window.kakao.maps.event.addListener(marker, "click", () => {
              onPinClick(item);
            });
          }

          marker.setMap(mapInstance);
          newMarkers.push(marker);
        });

        setMarkers(newMarkers);
      }
    };

    const centerMapOnLocation = (latitude: number, longitude: number) => {
      if (mapInstance) {
        const moveLatLon = new window.kakao.maps.LatLng(latitude, longitude);
        mapInstance.setCenter(moveLatLon);
        mapInstance.setLevel(5);
      }
    };

    useImperativeHandle(ref, () => ({
      centerMapOnLocation,
      updateMapMarkers,
      clearMarkers,
    }));

    return (

        <div id="map" style={{ width: "100%", height: "100%" }}></div>

    );
  }
);

MapComponent.displayName = "MapComponent";
export default MapComponent;
