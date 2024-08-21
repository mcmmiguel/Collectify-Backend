import { Request, Response } from 'express';
import User from '../model/User';
import i18n from '../config/i18n';

class UserController {
    static getUsers = async (req: Request, res: Response) => {
        try {
            const users = await User.find().sort({ createdAt: 'desc' });
            res.json(users);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: i18n.t("Error_TryAgain") });
        }
    }

    static blockUser = async (req: Request, res: Response) => {
        try {
            if (req.user.isBlocked) return;
            req.user.isBlocked = true;

            await req.user.save();

            res.json(req.user.isBlocked);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: i18n.t("Error_TryAgain") });
        }
    }

    static unlockUser = async (req: Request, res: Response) => {
        try {
            if (!req.user.isBlocked) return;
            req.user.isBlocked = false;

            await req.user.save();

            res.json(req.user.isBlocked);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: i18n.t("Error_TryAgain") });
        }
    }

    static assignAdmin = async (req: Request, res: Response) => {
        try {
            if (req.user.isAdmin) return;
            req.user.isAdmin = true;

            await req.user.save();

            res.json(req.user.isAdmin);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: i18n.t("Error_TryAgain") });
        }
    }

    static removeAdmin = async (req: Request, res: Response) => {
        try {
            if (!req.user.isAdmin) return;
            req.user.isAdmin = false;

            await req.user.save();

            res.json(req.user.isAdmin);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: i18n.t("Error_TryAgain") });
        }
    }

    static deleteUser = async (req: Request, res: Response) => {
        try {
            await req.user.deleteOne();
            res.send("Success_DeleteUser");
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: i18n.t("Error_TryAgain") });
        }
    }
}

export default UserController;