import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Movie, Review } from "@/types/movie";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/StarRating";
import { ReviewForm } from "@/components/ReviewForm";
import { ReviewCard } from "@/components/ReviewCard";
import { ArrowLeft, Film, Loader2 } from "lucide-react";
import { useState } from "react";

const fetchMovieDetails = async (movieId: string): Promise<Movie> => {
  const response = await fetch(`http://localhost:3000/api/movies/${movieId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch movie details");
  }
  return response.json();
};

const fetchMovieReviews = async (movieId: string): Promise<Review[]> => {
  const response = await fetch(`http://localhost:3000/api/reviews/${movieId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }
  return response.json();
};

const MovieDetail = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: movie, isLoading: movieLoading, error: movieError } = useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => fetchMovieDetails(movieId!),
    enabled: !!movieId,
  });

  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ["reviews", movieId, refreshKey],
    queryFn: () => fetchMovieReviews(movieId!),
    enabled: !!movieId,
  });

  const handleReviewSubmit = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (movieLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (movieError || !movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive text-lg mb-4">Failed to load movie details</p>
          <Button onClick={() => navigate("/")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container py-6">
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Movies
          </Button>
        </div>
      </header>

      {/* Movie Details */}
      <div className="container py-12">
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Poster */}
          <div className="lg:col-span-1">
            <div className="aspect-[2/3] rounded-lg overflow-hidden bg-secondary shadow-card">
              {movie.poster_url ? (
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Film className="w-24 h-24 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="font-display text-5xl font-bold text-foreground mb-4">
                {movie.title}
              </h1>
              
              <div className="flex flex-wrap gap-4 text-muted-foreground mb-6">
                {movie.release_year && <span>{movie.release_year}</span>}
                {movie.genre && <span>• {movie.genre}</span>}
                {movie.director && <span>• Directed by {movie.director}</span>}
              </div>

              {movie.average_rating !== undefined && (
                <div className="flex items-center gap-4 mb-6">
                  <StarRating rating={movie.average_rating} size="lg" />
                  <span className="text-2xl font-bold text-accent">
                    {movie.average_rating.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground">
                    ({reviews?.length || 0} {reviews?.length === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              )}
            </div>

            {movie.description && (
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                  Synopsis
                </h2>
                <p className="text-foreground leading-relaxed text-lg">
                  {movie.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Review Form */}
        <div className="mb-12">
          <ReviewForm movieId={movieId!} onSubmitSuccess={handleReviewSubmit} />
        </div>

        {/* Reviews List */}
        <div>
          <h2 className="font-display text-3xl font-bold text-foreground mb-6">
            Reviews {reviews && reviews.length > 0 && `(${reviews.length})`}
          </h2>

          {reviewsLoading && (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}

          {reviews && reviews.length > 0 && (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard key={review.review_id} review={review} />
              ))}
            </div>
          )}

          {reviews && reviews.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No reviews yet. Be the first to review this movie!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
