import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db.js';
import ticketRoutes from './routes/ticketRoutes.js';
import cors from 'cors';

// Initialize environment variables
dotenv.config();

const app = express();

app.use(cors());
// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB Atlas
connectDB();

app.use('/', (req, res) => {
    res.status(200).json({ message: "Api running successfully" });
});

app.use('/api/tickets', ticketRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});