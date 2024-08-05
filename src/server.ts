import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { connectDB } from './config/db';
import authRouter from './routes/authRoutes';
import collectionRouter from './routes/collectionRoutes';
import publicRouter from './routes/publicRoutes';
import { setupSocketEvents } from './events/socketEvents';
import adminRouter from './routes/adminRoutes';

const server = express();

dotenv.config();

const nodeServer = createServer(server);
const io = new Server(nodeServer);

connectDB();

// Read json from form
server.use(express.json());

server.use('/api/auth', authRouter);
server.use('/api/collections', collectionRouter);
server.use('/api/public/collections', publicRouter);
server.use('/api/admin', adminRouter);

setupSocketEvents(io);

export default nodeServer;