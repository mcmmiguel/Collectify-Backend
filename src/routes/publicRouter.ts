import { Router } from "express";
import CollectionController from "../controllers/CollectionController";

const router = Router();

router.get('/',
    CollectionController.getAllCollections,
);

export default router;