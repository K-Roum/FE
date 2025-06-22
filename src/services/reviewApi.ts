import { PlaceDetailModel } from "../model/PlaceDetailModel";

export const submitReview = async (
  placeId: number,
  languageCode: string,
  rating: number,
  comment: string
): Promise<any> => {
  const response = await fetch(
    `http://localhost:8080/reviews/${placeId}?languageCode=${languageCode}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
      credentials: "include",
      body: JSON.stringify({
        rating: rating,
        content: comment,
      }),
    }
  );
  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error("리뷰 제출 실패: " + response.statusText);
  }
  return responseBody;
};
