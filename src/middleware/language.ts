import { Request, Response, NextFunction } from "express";
import i18n from "../config/i18n";

export const changeLanguage = (req: Request, res: Response, next: NextFunction) => {
    const lng = req.headers['accept-language'];
    i18n.changeLanguage(lng);
    next();
}