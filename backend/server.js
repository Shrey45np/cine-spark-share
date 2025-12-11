import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import moviesRouter from './routes/movies.js';
import reviewsRouter from './routes/reviews.js';
import loginRouter from './routes/login.js';
import signupRouter from './routes/signup.js'
import { errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
  });
});

app.use('/api/movies', moviesRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/login', loginRouter);
app.use('/api/signup', signupRouter);



app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📝 API endpoints available at http://localhost:${PORT}/api`);
});

export default app;

