import express, { json } from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRouter from './routes/authRoutes';

const server = express();

dotenv.config();

connectDB();

// Read json from form
server.use(express.json());


server.use('/api/auth', authRouter);



export default server;