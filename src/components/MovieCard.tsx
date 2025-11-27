import { Movie } from "@/types/movie";
import { Card } from "@/components/ui/card";
import { StarRating } from "./StarRating";
import { useNavigate } from "react-router-dom";
import { Film } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard = ({ movie }: MovieCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/movie/${movie.movie_id}`)}
      className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(220,38,38,0.3)] bg-card border-border"
    >
      <div className="aspect-[2/3] relative overflow-hidden bg-secondary">
        {movie.poster_url ? (
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Film className="w-16 h-16 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-4 space-y-2">
        <h3 className="font-display text-xl font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {movie.title}
        </h3>
        
        {movie.release_year && (
          <p className="text-sm text-muted-foreground">{movie.release_year}</p>
        )}
        
        {movie.average_rating !== undefined && (
          <div className="flex items-center gap-2">
            <StarRating rating={movie.average_rating} size="sm" />
            <span className="text-sm font-medium text-accent">
              {movie.average_rating.toFixed(1)}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};
