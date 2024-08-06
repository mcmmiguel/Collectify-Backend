import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import User from '../model/User';
import { IUser } from '../model/User';

const authenticateSocket = async (socket: Socket, next: (err?: any) => void) => {
    try {
        const token = socket.handshake.headers.authorization?.split(' ')[1];

        if (!token) {
            return next(new Error('Unauthorized'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

        if (typeof decoded === 'object' && decoded.id) {
            const user = await User.findById(decoded.id).select('_id name email isAdmin isBlocked');

            if (user) {
                (socket as any).user = user;
                next();
            } else {
                next(new Error('Invalid token'));
            }
        } else {
            next(new Error('Invalid token'));
        }
    } catch (error) {
        next(new Error('Invalid token'));
    }
};
