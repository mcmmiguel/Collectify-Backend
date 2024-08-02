import { Request, Response, NextFunction } from "express";
import ItemCollection, { IItemCollection } from "../model/ItemCollection";

declare global {
    namespace Express {
        interface Request {
            itemCollection: IItemCollection;
        }
    }
}

export async function itemCollectionExists(req: Request, res: Response, next: NextFunction) {
    try {
        const { itemCollectionId } = req.params;

        const itemCollection = await ItemCollection.findById(itemCollectionId);

        if (!itemCollection) {
            const error = new Error('The collection does not exist.')
            res.status(404).json({ error: error.message });
        }

        req.itemCollection = itemCollection;

        next();
    } catch (error) {
        res.status(500).json({ error: 'There was an error.' })
    }
}