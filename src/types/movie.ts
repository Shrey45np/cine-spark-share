export interface Movie {
  movie_id: string;
  title: string;
  poster_url?: string;
  release_year?: number;
  genre?: string;
  director?: string;
  description?: string;
  average_rating?: number;
}

export interface Review {
  review_id: string;
  movie_id: string;
  reviewer_name: string;
  reviewer_email: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface ReviewFormData {
  movie_id: string;
  reviewer_name: string;
  reviewer_email: string;
  rating: number;
  comment: string;
}
