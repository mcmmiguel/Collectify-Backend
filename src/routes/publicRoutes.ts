import { Router } from "express";
import { param } from "express-validator";
import ItemCollectionController from "../controllers/ItemCollectionController";
import { handleInputErrors } from "../middleware/validation";
import ItemController from "../controllers/ItemController";
import { itemCollectionExists } from "../middleware/itemCollection";
import { itemBelongsToItemCollection, itemExists } from "../middleware/item";
import CategoryController from "../controllers/CategoryController";

const router = Router();

router.get('/',
    ItemCollectionController.getAllCollections,
);

router.get('/categories',
    CategoryController.getCategories,
);

router.get('/:itemCollectionId',
    param('itemCollectionId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    ItemCollectionController.getCollectionById,
);

// Verify if the itemCollectionExists since here
router.param('itemCollectionId', itemCollectionExists);

router.get('/:itemCollectionId/items', //TODO Probablemente se deba eliminar este endpoint, al obtener la coleccion, ya tiene los items
    ItemController.getAllItemsFromCollection,
);

router.param('itemId', itemExists);
router.param('itemId', itemBelongsToItemCollection);

router.get('/:itemCollectionId/items/:itemId',
    param('itemId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    ItemController.getItemById,
);

export default router;