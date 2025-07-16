export interface PlaceDetailModel {
  details: {
    reviews: {
      totalCount: number;
      averageRating: number;
      placesReviews: PlaceReview[];
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
export interface PlaceReview {
  nickName: string;
  content: string;
  rating: number;
  createdAt: string;}