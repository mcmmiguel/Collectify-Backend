import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../model/User';
import i18n from '../config/i18n';

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
        const error = new Error(i18n.t("Error_Unauthorized"));
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
                res.status(500).json({ error: i18n.t("Error_InvalidToken") });
            }
        }
    } catch (error) {
        res.status(500).json({ error: i18n.t("Error_InvalidToken") });
    }
}

export const hasOwnership = (req: Request, res: Response, next: NextFunction) => {

    if ((req.user._id.toString() !== req.itemCollection.owner._id.toString()) && !req.user.isAdmin) {
        const error = new Error(i18n.t("Error_InvalidAction"));
        return res.status(403).json({ error: error.message });
    }

    next();
}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {

    if (!req.user.isAdmin) {
        const error = new Error(i18n.t("Error_Unauthorized"));
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
        if (!user) return res.status(404).json({ error: i18n.t("Error_UserNotFound") });
        if (user.isBlocked) return res.status(403).json({ error: i18n.t("Error_AccountBlocked") });

        next();
    } catch (error) {
        console.log(error);
        res.status(403).json({ error: i18n.t("Error_TryAgain") });
    }
}