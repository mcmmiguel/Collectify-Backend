import { Router } from "express";
import ItemCollectionController from "../controllers/ItemCollectionController";
import { param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import ItemController from "../controllers/ItemController";
import { itemCollectionExists } from "../middleware/itemCollection";

const router = Router();

router.get('/',
    ItemCollectionController.getAllCollections,
);

router.get('/:itemCollectionId',
    param('itemCollectionId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    ItemCollectionController.getCollectionById,
);

// Verify if the itemCollectionExists since here
router.param('itemCollectionId', itemCollectionExists);

router.get('/:itemCollectionId/tasks',
    ItemController.getAllItemsFromCollection,
);

export default router;