import { PlaceDetailModel } from "../model/PlaceDetailModel";
import { SearchResultModel } from "../model/SearchResultModel";

export const fetchPlaceDetail = async (placeId: number, languageCode: string): Promise<PlaceDetailModel> => {
  const response = await fetch(
    `http://localhost:8080/places/${placeId}/with-everything?languageCode=${languageCode}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
      credentials: 'include',
    }
  );
  if (!response.ok) {
    throw new Error(`HTTP 오류, 상태 코드: ${response.status}`);
  }
  return await response.json();
};

export const toggleBookmark = async (placeId: number, bookmarked: boolean): Promise<any> => {
  const endpoint = `http://localhost:8080/bookmarks/${placeId}`;
  const method = bookmarked ? "DELETE" : "POST";
  const response = await fetch(endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
      accept: "*/*",
    },
    credentials: "include",
  });
  const responseBody = await response.json();
  console.log(method, endpoint);
  console.log(responseBody);
  if (!response.ok) {
    throw new Error(
      `북마크 ${bookmarked ? "취소" : "추가"} 실패:`
    );
  }
  return responseBody;
};