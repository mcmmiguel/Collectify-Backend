import { Request, Response, NextFunction } from "express";
import User from "../model/User";

export const userExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            const error = new Error('User not found.');
            return res.status(404).json({ error: error.message });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ error: 'There was an error.' })
    }
}