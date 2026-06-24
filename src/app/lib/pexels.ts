export interface PexelsImage {
  id: number;
  src: {
    small: string;
    medium: string;
    large: string;
  };
  photographer: string;
  photographer_url: string;
  alt: string;
}

export interface PexelsSearchResponse {
  photos: PexelsImage[];
  total_results: number;
  page: number;
  per_page: number;
}

export interface PexelsSearchRequest {
  query: string;
  per_page?: number;
  page?: number;
}
