export interface PlaceDetailModel {
  details: {
    reviews: {
      totalCount: number;
      averageRating: number;
      placesReviews: any[]; // 리뷰 객체 정의 시 타입 추가
    };
    bookmark: {
      bookmarkCount: number;
      bookmarked: boolean;
    };
  };
  recommendations: Recommendation[];
}

export interface Recommendation {
  place: {
    latitude: number;
    longitude: number;
    firstImageUrl: string;
    placeName: string;
    description: string;
    address: string;
    bookmarked: boolean;
    placeId: number;
  };
  distance: number;
}
