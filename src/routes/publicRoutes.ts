import { Router } from "express";
import ItemCollectionController from "../controllers/ItemCollectionController";
import { param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

router.get('/',
    ItemCollectionController.getAllCollections,
);

router.get('/:itemCollectionId',
    param('itemCollectionId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    ItemCollectionController.getCollectionById,
)

export default router;