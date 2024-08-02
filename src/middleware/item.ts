import { Request, Response, NextFunction } from "express";
import Item, { I_Item } from "../model/Item";

declare global {
    namespace Express {
        interface Request {
            item?: I_Item;
        }
    }
}

export const itemExists = async (req: Request, res: Response, next: NextFunction) => {

    const { itemId } = req.params;

    try {

        const item = await Item.findById(itemId);

        if (!item) {
            const error = new Error('The item does not exist.');
            return res.status(404).json({ error: error.message });
        }

        req.item = item;

        next();

    } catch (error) {
        return res.status(500).json({ error: 'Hubo un error' });
    }

}

export const itemBelongsToItemCollection = async (req: Request, res: Response, next: NextFunction) => {

    if (req.itemCollection._id.toString() !== req.item.itemCollection.toString()) {
        const error = new Error('Invalid action');
        return res.status(403).json({ error: error.message });
    }

    next();

}