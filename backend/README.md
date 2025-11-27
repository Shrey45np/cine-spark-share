# Movie Review System - Backend API

Backend API for the Movie Review System built with Node.js, Express, and Supabase.

## Features

- RESTful API endpoints for movies and reviews
- Input validation for all requests
- Error handling with proper HTTP status codes
- CORS enabled for frontend integration
- Supabase PostgreSQL database integration

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account with a project set up

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Variables

Create a `.env` file in the `backend` directory:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
PORT=3000
NODE_ENV=development
```

**Where to find your Supabase credentials:**
- Go to your Supabase project dashboard
- Navigate to Settings > API
- Copy the "Project URL" → `SUPABASE_URL`
- Copy the "service_role" key (secret) → `SUPABASE_SERVICE_KEY`

### 3. Database Setup

Make sure your Supabase database has the following tables:

#### Table: `movies`
```sql
CREATE TABLE movies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  genre TEXT,
  release_year INTEGER
);
```

#### Table: `reviews`
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  reviewer_name TEXT NOT NULL,
  reviewer_email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Run the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:3000` (or the PORT specified in your `.env` file).

## API Endpoints

### Base URL
```
http://localhost:3000/api
```

### 1. GET /api/movies
Returns all movies with their average ratings.

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "title": "Movie Title",
      "genre": "Action",
      "release_year": 2023,
      "avg_rating": 4.5
    }
  ]
}
```

### 2. GET /api/movies/:movie_id
Returns movie details and all related reviews.

**Response:**
```json
{
  "status": "success",
  "data": {
    "movie": {
      "id": "uuid",
      "title": "Movie Title",
      "genre": "Action",
      "release_year": 2023,
      "avg_rating": 4.5
    },
    "reviews": [...]
  }
}
```

### 3. POST /api/reviews
Creates a new review.

**Request Body:**
```json
{
  "movie_id": "uuid",
  "reviewer_name": "John Doe",
  "reviewer_email": "john@example.com",
  "rating": 4,
  "comment": "Great movie!"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "message": "Review created successfully",
    "id": "uuid",
    "review": {...}
  }
}
```

**Validation:**
- `movie_id`: Required, must be a valid UUID
- `reviewer_name`: Required
- `reviewer_email`: Required, must be a valid email format
- `rating`: Required, must be between 1 and 5
- `comment`: Optional

### 4. GET /api/reviews/:movie_id
Returns all reviews for a specific movie, sorted by creation date (newest first).

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "movie_id": "uuid",
      "reviewer_name": "John Doe",
      "reviewer_email": "john@example.com",
      "rating": 4,
      "comment": "Great movie!",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## Error Responses

All errors follow this format:

```json
{
  "status": "error",
  "message": "Error description"
}
```

**HTTP Status Codes:**
- `400` - Bad Request (validation errors, invalid input)
- `404` - Not Found (movie/review doesn't exist)
- `500` - Internal Server Error

## Project Structure

```
backend/
├── config/
│   └── supabase.js      # Supabase client configuration
├── middleware/
│   ├── errorHandler.js  # Global error handling
│   └── validation.js    # Input validation middleware
├── routes/
│   ├── movies.js        # Movie endpoints
│   └── reviews.js       # Review endpoints
├── database/
│   └── schema.sql       # Database schema SQL file
├── .env                 # Environment variables (not in git)
├── .env.example         # Example environment variables
├── .gitignore
├── package.json
├── server.js            # Main server file
└── README.md
```

## Development

### Testing Endpoints

You can test the API using tools like:
- Postman
- cURL
- HTTPie
- Your frontend application

Example cURL commands:

```bash
# Get all movies
curl http://localhost:3000/api/movies

# Get movie by ID
curl http://localhost:3000/api/movies/{movie_id}

# Create a review
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "movie_id": "uuid",
    "reviewer_name": "John Doe",
    "reviewer_email": "john@example.com",
    "rating": 4,
    "comment": "Great movie!"
  }'

# Get reviews for a movie
curl http://localhost:3000/api/reviews/{movie_id}
```

## Notes

- The service uses Supabase's service role key for database operations, which bypasses Row Level Security (RLS). Make sure to keep this key secure.
- CORS is enabled for all origins. In production, you may want to restrict this to your frontend domain.
- All timestamps are in UTC format.
- Average ratings are rounded to 1 decimal place.

