import express from 'express';
import { supabase } from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateReview, validateUUID } from '../middleware/validation.js';

const router = express.Router();

// POST /api/reviews - Insert a new review
router.post(
  '/',
  validateReview,
  asyncHandler(async (req, res) => {
    const { movie_id, reviewer_name, reviewer_email, rating, comment } = req.body;

    // Verify movie exists
    const { data: movie, error: movieError } = await supabase
      .from('movies')
      .select('id')
      .eq('id', movie_id)
      .single();

    if (movieError || !movie) {
      return res.status(400).json({
        status: 'error',
        message: 'Movie not found. Please provide a valid movie_id',
      });
    }

    // Insert review
    const { data: review, error: insertError } = await supabase
      .from('reviews')
      .insert({
        movie_id,
        reviewer_name,
        reviewer_email,
        rating,
        comment: comment || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      throw { statusCode: 500, message: 'Failed to create review' };
    }

    res.status(201).json({
      status: 'success',
      data: {
        message: 'Review created successfully',
        id: review.id,
        review: review,
      },
    });
  })
);

// GET /api/reviews/:movie_id - Return reviews for a specific movie
router.get(
  '/:movie_id',
  asyncHandler(async (req, res) => {
    const { movie_id } = req.params;

    // Verify movie exists
    const { data: movie, error: movieError } = await supabase
      .from('movies')
      .select('id')
      .eq('id', movie_id)
      .single();

    if (movieError || !movie) {
      return res.status(404).json({
        status: 'error',
        message: 'Movie not found',
      });
    }

    // Fetch reviews
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .eq('movie_id', movie_id)
      .order('created_at', { ascending: false });

    if (reviewsError) {
      throw { statusCode: 500, message: 'Failed to fetch reviews' };
    }

    // Transform reviews to match frontend expectations
    const transformedReviews = (reviews || []).map((review) => ({
      review_id: review.id,
      movie_id: review.movie_id,
      reviewer_name: review.reviewer_name,
      reviewer_email: review.reviewer_email,
      rating: review.rating,
      comment: review.comment || '',
      created_at: review.created_at,
    }));

    res.status(200).json(transformedReviews);
  })
);

export default router;

