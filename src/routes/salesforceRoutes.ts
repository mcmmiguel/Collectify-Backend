import { Router } from "express";
import SalesforceController from "../controllers/SalesforceController";
import { body } from "express-validator";

const router = Router();

router.post('/create-contact',
    body('firstName')
        .notEmpty().trim().withMessage('The first name must not be empty'),
    body('lastName')
        .notEmpty().trim().withMessage('The last name must not be empty'),
    body('email')
        .notEmpty().trim().isEmail().withMessage('Invalid email'),
    body('phone')
        .notEmpty().isLength({ min: 10, max: 10 }).withMessage('The phone number must have exactly 10 digits'),
    SalesforceController.createAccountWithContact
);

export default router;