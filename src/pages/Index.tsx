import { useQuery } from "@tanstack/react-query";
import { Movie } from "@/types/movie";
import { MovieCard } from "@/components/MovieCard";
import { Film, Loader2 } from "lucide-react";

const fetchMovies = async (): Promise<Movie[]> => {
  const response = await fetch("http://localhost:3000/api/movies");
  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }
  return response.json();
};

const Index = () => {
  const { data: movies, isLoading, error } = useQuery({
    queryKey: ["movies"],
    queryFn: fetchMovies,
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-6">
          <div className="flex items-center gap-3">
            <Film className="w-8 h-8 text-primary" />
            <h1 className="font-display text-4xl font-bold text-foreground">
              Cine<span className="text-primary">Review</span>
            </h1>
          </div>
          <p className="mt-2 text-muted-foreground">
            Discover and review your favorite movies
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-destructive text-lg">
              Failed to load movies. Please make sure the API server is running on localhost:3000
            </p>
          </div>
        )}

        {movies && movies.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.movie_id} movie={movie} />
            ))}
          </div>
        )}

        {movies && movies.length === 0 && (
          <div className="text-center py-20">
            <Film className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              No movies available yet
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
