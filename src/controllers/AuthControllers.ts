import { Request, Response } from 'express'
import User from '../model/User';


class AuthController {
    static registerUser = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            const user = new User(req.body);

            await user.save();

            res.json('Account created successfully. Sign in now.');
        } catch (error) {
            res.status(500).json({ error: 'There was an error. Try again later.' });
        }
    }
}

export default AuthController;