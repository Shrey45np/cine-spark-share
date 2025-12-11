import express from 'express';
import { supabase } from '../config/supabase.js';
import { asyncHandler, errorHandler } from '../middleware/errorHandler.js';
import { validateUUID } from '../middleware/validation.js';

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { data: movies, error: moviesError } = await supabase
      .from('movies')
      .select(
        `
        id,
        title,
        genre,
        release_year,
        poster_url,
        reviews:reviews(rating)
      `
      );

    if (moviesError) {
      throw { statusCode: 500, message: 'Failed to fetch movies' };
    }

    const moviesWithRatings = (movies || []).map((movie) => {
      const ratings = movie.reviews || [];
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / ratings.length
          : 0;

      return {
        movie_id: movie.id,
        title: movie.title,
        genre: movie.genre,
        release_year: movie.release_year,
        poster_url: movie.poster_url || null,
        average_rating: Math.round(avgRating * 10) / 10,
      };
    });

    res.status(200).json(moviesWithRatings);
  })
);

router.get(
  '/:movie_id',
  asyncHandler(async (req, res) => {
    const { movie_id } = req.params;

    const { data: movie, error: movieError } = await supabase
      .from('movies')
      .select('*')
      .eq('id', movie_id)
      .single();

    if (movieError) {
      if (movieError.code === 'PGRST116') {
        // No rows returned
        return res.status(404).json({
          status: 'error',
          message: 'Movie not found',
        });
      }
      throw { statusCode: 500, message: 'Failed to fetch movie details' };
    }

    if (!movie) {
      return res.status(404).json({
        status: 'error',
        message: 'Movie not found',
      });
    }

    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .eq('movie_id', movie_id)
      .order('created_at', { ascending: false });

    if (reviewsError) {
      throw { statusCode: 500, message: 'Failed to fetch reviews' };
    }

    const ratings = reviews || [];
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / ratings.length
        : 0;

    res.status(200).json({
      movie_id: movie.id,
      title: movie.title,
      genre: movie.genre,
      release_year: movie.release_year,
      average_rating: Math.round(avgRating * 10) / 10,
      director: movie.director || null,
      description: movie.description || null,
      poster_url: movie.poster_url || null,
    });
  })
);

export default router;

