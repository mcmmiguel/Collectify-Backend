import { Router } from "express";
import { body } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import AuthController from "../controllers/AuthControllers";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post('/register',
    body('name')
        .notEmpty().trim().withMessage('The name must not be empty'),
    body('email')
        .notEmpty().trim().isEmail().withMessage('Invalid email'),
    body('password')
        .notEmpty().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('password_confirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),
    handleInputErrors,
    AuthController.registerUser,
);

router.post('/login',
    body('email')
        .notEmpty().trim().isEmail().withMessage('Invalid email'),
    body('password')
        .notEmpty().withMessage('Password must not be empty'),
    handleInputErrors,
    AuthController.login,
);

router.get('/user',
    authenticate,
    AuthController.user
)

export default router;