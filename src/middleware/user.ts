import { Request, Response, NextFunction } from "express";
import User from "../model/User";
import i18n from "../config/i18n";

export const userExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            const error = new Error(i18n.t("Error_UserNotFound"));
            return res.status(404).json({ error: error.message });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ error: i18n.t("Error_TryAgain") });
    }
}