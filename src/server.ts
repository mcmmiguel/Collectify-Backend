import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { connectDB } from './config/db';
import { setupSocketEvents } from './events/socketEvents';
import adminRouter from './routes/adminRoutes';
import authRouter from './routes/authRoutes';
import collectionRouter from './routes/collectionRoutes';
import publicRouter from './routes/publicRoutes';
import { corsConfig } from './config/cors';

const server = express();

dotenv.config();

const nodeServer = createServer(server);
const io = new Server(nodeServer, { cors: corsConfig });

connectDB();

// Read json from form
server.use(express.json());

// server.use(cors(corsConfig));

server.use('/api/auth', authRouter);
server.use('/api/collections', collectionRouter);
server.use('/api/public/collections', publicRouter);
server.use('/api/admin', adminRouter);

setupSocketEvents(io);

export default nodeServer;