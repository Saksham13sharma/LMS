import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware } from '@clerk/express';
import { connectDB } from './config/db.js';
import courseRouter from './routes/courseRoute.js';
import bookingRouter from './routes/bookingRouter.js';

const app = express();

// CORS
app.use(cors({
  origin: [
    'http://localhost:5174',
    'https://lms-sepia-beta.vercel.app',
    'https://lms-git-main-sakshan6398-9479s-projects.vercel.app'
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());

app.use('/uploads', express.static('uploads'));

// DB
connectDB();

// ROUTES
app.use('/api/course', courseRouter);
app.use('/api/booking', bookingRouter);

// Default route
app.get('/', (req, res) => {
    res.send('API WORKING');
});

// PORT FIX (IMPORTANT)
const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});