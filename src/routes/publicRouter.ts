import { Router } from "express";
import CollectionController from "../controllers/CollectionController";
import { param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

router.get('/',
    CollectionController.getAllCollections,
);

router.get('/:collectionId',
    param('collectionId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    CollectionController.getCollectionById,
)

export default router;