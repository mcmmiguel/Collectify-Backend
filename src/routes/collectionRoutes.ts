import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import ItemCollectionController from "../controllers/ItemCollectionController";
import { authenticate, hasAuthorization } from "../middleware/auth";
import { itemCollectionExists } from "../middleware/itemCollection";

const router = Router();

router.use(authenticate);

// COLLECTIONS
router.post('/create-collection',
    body('collectionName')
        .notEmpty().withMessage('The collection name must not be empty'),
    handleInputErrors,
    ItemCollectionController.createCollection
);

router.param('itemCollectionId', itemCollectionExists);

router.put('/:itemCollectionId',
    param('itemCollectionId').isMongoId().withMessage('Invalid ID'),
    body('collectionName').notEmpty().withMessage('The collection name must not be empty'),
    handleInputErrors,
    hasAuthorization,
    ItemCollectionController.updateCollection,
);

router.delete('/:itemCollectionId',
    param('itemCollectionId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    hasAuthorization,
    ItemCollectionController.deleteCollection,
)

export default router;