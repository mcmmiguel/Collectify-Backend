import { Request, Response } from 'express'
import User from '../model/User';
import { hashPassword } from '../utils/auth';
class AuthController {
    static registerUser = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            const userExists = await User.findOne({ email });
            if (userExists) {
                const error = new Error('This email is already registered');
                return res.status(409).json({ error: error.message });
            }

            const user = new User(req.body);

            user.password = await hashPassword(password);

            await user.save();

            res.json('Account created successfully. Sign in now.');
        } catch (error) {
            res.status(500).json({ error: 'There was an error. Try again later.' });
        }
    }
}

export default AuthController;