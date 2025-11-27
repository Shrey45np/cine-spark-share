import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { StarRating } from "./StarRating";
import { ReviewFormData } from "@/types/movie";
import { useToast } from "@/hooks/use-toast";

interface ReviewFormProps {
  movieId: string;
  onSubmitSuccess?: () => void;
}

export const ReviewForm = ({ movieId, onSubmitSuccess }: ReviewFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Omit<ReviewFormData, "movie_id">>({
    reviewer_name: "",
    reviewer_email: "",
    rating: 0,
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:3000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movie_id: movieId,
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      toast({
        title: "Review Submitted!",
        description: "Thank you for sharing your thoughts.",
      });

      setFormData({
        reviewer_name: "",
        reviewer_email: "",
        rating: 0,
        comment: "",
      });

      onSubmitSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 bg-card border-border">
      <h2 className="font-display text-2xl font-bold mb-6 text-foreground">
        Write Your Review
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-foreground">Name</Label>
          <Input
            id="name"
            placeholder="Name"
            value={formData.reviewer_name}
            onChange={(e) => setFormData({ ...formData, reviewer_name: e.target.value })}
            required
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Email"
            value={formData.reviewer_email}
            onChange={(e) => setFormData({ ...formData, reviewer_email: e.target.value })}
            required
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Rating</Label>
          <div className="flex items-center gap-4">
            <StarRating
              rating={formData.rating}
              onRatingChange={(rating) => setFormData({ ...formData, rating })}
              interactive
              size="lg"
            />
            <span className="text-sm text-muted-foreground">
              {formData.rating > 0 ? `${formData.rating} star${formData.rating !== 1 ? 's' : ''}` : 'Enter your rating (1 to 5 stars)'}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="review" className="text-foreground">Review</Label>
          <Textarea
            id="review"
            placeholder="Type your review..."
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            required
            rows={8}
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground resize-none"
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg h-12"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </Card>
  );
};
