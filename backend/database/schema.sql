-- Movie Review System Database Schema
-- Run this SQL in your Supabase SQL Editor to create the required tables

-- Create movies table
CREATE TABLE IF NOT EXISTS movies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  genre TEXT,
  release_year INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  reviewer_name TEXT NOT NULL,
  reviewer_email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index on movie_id for faster queries
CREATE INDEX IF NOT EXISTS idx_reviews_movie_id ON reviews(movie_id);

-- Create index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

-- Create index on id for movies table (if needed)
CREATE INDEX IF NOT EXISTS idx_movies_id ON movies(id);

-- Optional: Enable Row Level Security (RLS) if needed
-- Note: Service role key bypasses RLS, so these policies won't affect the API
-- ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Optional: Add comments to tables for documentation
COMMENT ON TABLE movies IS 'Stores movie information';
COMMENT ON TABLE reviews IS 'Stores movie reviews submitted by users';

COMMENT ON COLUMN movies.id IS 'Unique identifier for each movie';
COMMENT ON COLUMN movies.title IS 'Title of the movie';
COMMENT ON COLUMN movies.genre IS 'Genre of the movie';
COMMENT ON COLUMN movies.release_year IS 'Year the movie was released';

COMMENT ON COLUMN reviews.id IS 'Unique identifier for each review';
COMMENT ON COLUMN reviews.movie_id IS 'Foreign key referencing movies.id';
COMMENT ON COLUMN reviews.reviewer_name IS 'Name of the reviewer';
COMMENT ON COLUMN reviews.reviewer_email IS 'Email address of the reviewer';
COMMENT ON COLUMN reviews.rating IS 'Rating from 1 to 5';
COMMENT ON COLUMN reviews.comment IS 'Optional comment/review text';
COMMENT ON COLUMN reviews.created_at IS 'Timestamp when the review was created';

