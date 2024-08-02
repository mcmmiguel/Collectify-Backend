import { Router } from "express";
import { body } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import CollectionController from "../controllers/CollectionController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.post('/create-collection',
    body('collectionName')
        .notEmpty().withMessage('The collection name must not be empty'),
    handleInputErrors,
    CollectionController.createCollection
);


export default router;