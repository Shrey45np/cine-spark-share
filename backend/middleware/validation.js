// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// UUID validation regex
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Middleware to validate review data
export const validateReview = (req, res, next) => {
  try {
    // Validate required fields
    const { movie_id, reviewer_name, reviewer_email, rating, comment } = req.body;

    if (!movie_id) {
      return res.status(400).json({
        status: 'error',
        message: 'movie_id is required',
      });
    }

    // Validate movie_id is not empty (allow both UUID and numeric IDs)
    if (!movie_id || typeof movie_id !== 'string') {
      return res.status(400).json({
        status: 'error',
        message: 'movie_id must be a valid string',
      });
    }

    if (!reviewer_name || reviewer_name.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'reviewer_name is required',
      });
    }

    if (!reviewer_email || reviewer_email.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'reviewer_email is required',
      });
    }

    // Validate email format
    if (!emailRegex.test(reviewer_email)) {
      return res.status(400).json({
        status: 'error',
        message: 'reviewer_email must be a valid email address',
      });
    }

    if (rating === undefined || rating === null) {
      return res.status(400).json({
        status: 'error',
        message: 'rating is required',
      });
    }

    // Validate rating is a number
    const ratingNum = Number(rating);
    if (isNaN(ratingNum)) {
      return res.status(400).json({
        status: 'error',
        message: 'rating must be a number',
      });
    }

    // Validate rating range
    if (ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({
        status: 'error',
        message: 'rating must be between 1 and 5',
      });
    }

    // Normalize data
    req.body = {
      movie_id: movie_id.trim(),
      reviewer_name: reviewer_name.trim(),
      reviewer_email: reviewer_email.trim().toLowerCase(),
      rating: Math.floor(ratingNum),
      comment: comment ? comment.trim() : null,
    };

    next();
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: error.message || 'Validation failed',
    });
  }
};

// Middleware to validate UUID format (for URL parameters)
export const validateUUID = (req, res, next) => {
  const { movie_id } = req.params;

  if (movie_id && !uuidRegex.test(movie_id)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid movie_id format. Must be a valid UUID',
    });
  }

  next();
};

