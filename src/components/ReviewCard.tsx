import { Review } from "@/types/movie";
import { Card } from "@/components/ui/card";
import { StarRating } from "./StarRating";
import { User } from "lucide-react";

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  const date = new Date(review.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6 text-muted-foreground" />
        </div>
        
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="font-semibold text-foreground">{review.reviewer_name}</h4>
              <p className="text-sm text-muted-foreground">{date}</p>
            </div>
            <StarRating rating={review.rating} size="sm" />
          </div>
          
          <p className="text-foreground leading-relaxed">{review.comment}</p>
        </div>
      </div>
    </Card>
  );
};
