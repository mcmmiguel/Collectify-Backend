import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import ItemCollectionController from "../controllers/ItemCollectionController";
import { authenticate, hasOwnership, verifyStatus } from "../middleware/auth";
import { itemCollectionExists } from "../middleware/itemCollection";
import ItemController from "../controllers/ItemController";
import { itemBelongsToItemCollection, itemExists } from "../middleware/item";

const router = Router();

router.use(authenticate, verifyStatus);

// COLLECTIONS
router.post('/create-collection',
    body('collectionName')
        .notEmpty().withMessage('The collection name must not be empty.'),
    body('description')
        .notEmpty().withMessage('The collection description must not be empty.'),
    handleInputErrors,
    ItemCollectionController.createCollection
);

router.param('itemCollectionId', itemCollectionExists);

router.put('/:itemCollectionId',
    param('itemCollectionId').isMongoId().withMessage('Invalid ID'),
    body('collectionName').notEmpty().withMessage('The collection name must not be empty.'),
    handleInputErrors,
    hasOwnership,
    ItemCollectionController.updateCollection,
);

router.delete('/:itemCollectionId',
    param('itemCollectionId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    hasOwnership,
    ItemCollectionController.deleteCollection,
);


// ITEMS
router.post('/:itemCollectionId/items',
    hasOwnership,
    body('itemName').notEmpty().withMessage('The item name must not be empty.'),
    handleInputErrors,
    ItemController.createItem,
);

router.param('itemId', itemExists);
router.param('itemId', itemBelongsToItemCollection);

router.put('/:itemCollectionId/items/:itemId',
    hasOwnership,
    param('itemId').isMongoId().withMessage('Invalid ID'),
    body('itemName').notEmpty().withMessage('The item name must not be empty'),
    handleInputErrors,
    ItemController.updateItem,
);

router.delete('/:itemCollectionId/items/:itemId',
    hasOwnership,
    param('itemId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    ItemController.deleteItem
);



export default router;