import { Request, Response } from 'express'
import User from '../model/User';
import { checkPassword, hashPassword } from '../utils/auth';
import { generateJWT } from '../utils/jwt';
import i18n from '../config/i18n';
class AuthController {
    static registerUser = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            const userExists = await User.findOne({ email });
            if (userExists) {
                const error = new Error(i18n.t("Error_EmailRegistered"));
                return res.status(409).json({ error: error.message });
            }

            const user = new User(req.body);

            user.password = await hashPassword(password);

            await user.save();

            res.send(i18n.t("Success_CreateAccount"));
        } catch (error) {
            res.status(500).json({ error: i18n.t("Error_TryAgain") });
        }
    }

    static login = async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            const error = new Error(i18n.t("Error_UserNotFound"));
            return res.status(401).json({ error: error.message });
        }

        const isPasswordCorrect = await checkPassword(password, user.password);

        if (!isPasswordCorrect) {
            const error = new Error(i18n.t("Error_IncorrectPassword"));
            return res.status(401).json({ error: error.message });
        }

        //TODO Verify .id or _id
        const token = generateJWT({ id: user.id });

        res.send(token);
    }

    static user = async (req: Request, res: Response) => {
        return res.json(req.user);
    }
}

export default AuthController;