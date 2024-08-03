import { Router } from "express";
import { param } from "express-validator";
import ItemCollectionController from "../controllers/ItemCollectionController";
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

router.get('/:itemCollectionId/items', //TODO Probablemente se deba eliminar este endpoint, al obtener la coleccion, ya tiene los items
    ItemController.getAllItemsFromCollection,
);

router.get('/:itemCollectionId/items/:itemId',
    param('itemId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    ItemController.getItemById,
);

export default router;