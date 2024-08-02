import express, { json } from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRouter from './routes/authRoutes';
import collectionRouter from './routes/collectionRoutes';
import publicRouter from './routes/publicRoutes';

const server = express();

dotenv.config();

connectDB();

// Read json from form
server.use(express.json());

server.use('/api/auth', authRouter);
server.use('/api/collections', collectionRouter);
server.use('/api/public/collections', publicRouter);

export default server;