import config from "../config";
import { PlaceDetailModel } from "../model/PlaceDetailModel";
import { SearchResultModel } from "../model/SearchResultModel";

export const fetchPlaceDetail = async (
  placeId: number,
  languageCode: string
): Promise<PlaceDetailModel> => {
  const response = await fetch(
    `${config.apiBaseUrl}/places/${placeId}/with-everything?languageCode=${languageCode}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error(`HTTP 오류, 상태 코드: ${response.status}`);
  }
  return await response.json();
};

export const toggleBookmark = async (
  placeId: number,
  bookmarked: boolean
): Promise<any> => {
  const endpoint = `${config.apiBaseUrl}/bookmarks/${placeId}`;
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
  if (!response.ok) {
    throw new Error(`북마크 ${bookmarked ? "취소" : "추가"} 실패:`);
  }
  return responseBody;
};
export const fetchRecentSearches = async () => {
  try {
    const response = await fetch(`${config.apiBaseUrl}/search-history`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`서버 오류: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("최근 검색어 불러오기 실패:", error);
  }
};

export const performSearch = async (query: string, currentLang: string) => {
  try {
    const response = await fetch(`${config.apiBaseUrl}/places/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
      credentials: "include",
      body: JSON.stringify({
        query: query,
        languageCode: currentLang,
      }),
    });

    if (!response.ok) {
      throw new Error(`서버 오류: ${response.status}`);
    }
    const data: SearchResultModel[] = await response.json();
    return data;
  } catch (error) {
    console.error("검색 중 오류 발생:", error);
    alert("검색에 실패했습니다.");
  }
};

export const imageSearch = async (placeId: string, currentLang: string) => {
  const response = await fetch(
    `${config.apiBaseUrl}/places/${placeId}/with-everything-by-image?languageCode=${currentLang}`,
    { credentials: "include" }
  );

  if (!response.ok) {
    throw new Error(`서버 오류: ${response.status}`);
  }
  const data: SearchResultModel[] = await response.json();
    return data;
};
