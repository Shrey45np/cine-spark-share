# Quick Setup Guide

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

## Step 2: Configure Environment Variables

1. Copy `ENV_EXAMPLE.txt` to `.env`:
   ```bash
   cp ENV_EXAMPLE.txt .env
   ```

2. Edit `.env` and add your Supabase credentials:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_SERVICE_KEY`: Your Supabase service role key (secret)

   Find these in: Supabase Dashboard → Settings → API

## Step 3: Set Up Database Tables

1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Copy and paste the contents of `database/schema.sql`
4. Run the SQL script to create the tables

Or create tables manually:

**movies table:**
- id (UUID, Primary Key, Default: gen_random_uuid())
- title (TEXT, NOT NULL)
- genre (TEXT, nullable)
- release_year (INTEGER, nullable)

**reviews table:**
- id (UUID, Primary Key, Default: gen_random_uuid())
- movie_id (UUID, Foreign Key → movies.id, NOT NULL)
- reviewer_name (TEXT, NOT NULL)
- reviewer_email (TEXT, NOT NULL)
- rating (INTEGER, NOT NULL, CHECK 1-5)
- comment (TEXT, nullable)
- created_at (TIMESTAMP, Default: NOW())

## Step 4: Start the Server

```bash
npm run dev   # Development mode (with auto-reload)
# or
npm start     # Production mode
```

Server will start on `http://localhost:3000`

## Step 5: Test the API

### Health Check
```bash
curl http://localhost:3000/health
```

### Get All Movies
```bash
curl http://localhost:3000/api/movies
```

### Get Movie by ID
```bash
curl http://localhost:3000/api/movies/{movie_id}
```

### Create Review
```bash
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "movie_id": "your-movie-uuid",
    "reviewer_name": "John Doe",
    "reviewer_email": "john@example.com",
    "rating": 4,
    "comment": "Great movie!"
  }'
```

### Get Reviews for Movie
```bash
curl http://localhost:3000/api/reviews/{movie_id}
```

## Troubleshooting

1. **"Missing Supabase configuration" error**
   - Make sure `.env` file exists and contains valid credentials
   - Check that environment variable names match exactly

2. **Database connection errors**
   - Verify your Supabase URL and service key are correct
   - Check that your Supabase project is active

3. **Table not found errors**
   - Run the SQL schema from `database/schema.sql` in Supabase SQL Editor
   - Verify table names match exactly: `movies` and `reviews`

4. **CORS errors from frontend**
   - The backend has CORS enabled for all origins
   - If issues persist, check that the backend is running and accessible

## Next Steps

- Connect your frontend to the API endpoints
- Add sample movie data to test the endpoints
- Deploy the backend to a hosting service (Vercel, Railway, etc.)

