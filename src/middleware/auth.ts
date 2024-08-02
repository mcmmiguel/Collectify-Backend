import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../model/User';

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {

    const bearer = req.headers.authorization;
    if (!bearer) {
        const error = new Error('Unauthorized');
        return res.status(401).json({ error: error.message });
    }

    const token = bearer.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (typeof decoded === 'object' && decoded.id) {
            const user = await User.findById(decoded.id).select('_id name email isAdmin isBlocked');

            if (user) {
                req.user = user;
                next();
            } else {
                res.status(500).json({ error: 'Invalid token' });
            }
        }
    } catch (error) {
        res.status(500).json({ error: 'Invalid token' });
    }
}

export const hasAuthorization = (req: Request, res: Response, next: NextFunction) => {

    if ((req.user.id !== req.itemCollection.owner) && !req.user.isAdmin) {
        const error = new Error('Invalid action');
        return res.status(403).json({ error: error.message });
    }

    next();
}