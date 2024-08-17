import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import User from '../model/User';

const authenticateSocket = async (socket: Socket, next: (err?: any) => void) => {
    try {
        const authHeader = socket.handshake.auth.headers.Authorization;
        if (!authHeader) {
            return next(new Error('Unauthorized'));
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return next(new Error('Unauthorized'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        if (!decoded || !decoded.id) {
            return next(new Error('Invalid token'));
        }

        const user = await User.findById(decoded.id).select('_id name email isAdmin isBlocked');
        if (!user) {
            return next(new Error('Invalid token'));
        }

        (socket as any).user = user;
        next();
    } catch (error) {
        next(new Error('Invalid token'));
    }
};

export default authenticateSocket;
