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

export const hasOwnership = (req: Request, res: Response, next: NextFunction) => {

    if ((req.user._id.toString() !== req.itemCollection.owner._id.toString()) && !req.user.isAdmin) {
        const error = new Error('Invalid action');
        return res.status(403).json({ error: error.message });
    }

    next();
}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {

    if (!req.user.isAdmin) {
        const error = new Error('Unauthorized');
        return res.status(403).json({ error: error.message });
    }

    next();
}

export const verifyStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        /*  req.user = if I have JWT - This is for protected routes, less login
            req.body = if I don't have JWT, take the email from the form - LOGIN
            This implementation is complemented by the authentication middleware
        */
        const { email } = req.user || req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });
        if (user.isBlocked) return res.status(403).json({ error: 'Account blocked. Please contact an admin to unlock it.' });

        next();
    } catch (error) {
        console.log(error);
        res.status(403).json({ error: 'Something went wrong' })
    }
}