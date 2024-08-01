import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';

const server = express();

dotenv.config();

connectDB();




export default server;