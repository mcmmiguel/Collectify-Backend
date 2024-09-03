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
import searchRouter from './routes/searchRoutes';
import salesforceRouter from './routes/salesforceRoutes';
import { corsConfig } from './config/cors';
import i18n from './config/i18n';
import Middleware from 'i18next-http-middleware';
import { changeLanguage } from './middleware/language';

const server = express();

dotenv.config();

const nodeServer = createServer(server);
const io = new Server(nodeServer, { cors: corsConfig });

connectDB();

// Read json from form
server.use(express.json());

server.use(cors(corsConfig));
server.use(Middleware.handle(i18n));
server.use(changeLanguage);

server.use('/api/auth', authRouter);
server.use('/api/collections', collectionRouter);
server.use('/api/public/collections', publicRouter);
server.use('/api/admin', adminRouter);
server.use('/api/search', searchRouter);
server.use('/api/salesforce', salesforceRouter);

setupSocketEvents(io);

export default nodeServer;