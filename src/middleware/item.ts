import { Request, Response, NextFunction } from "express";
import Item, { I_Item } from "../model/Item";
import i18n from "../config/i18n";

declare global {
    namespace Express {
        interface Request {
            item?: I_Item;
        }
    }
}

export const itemExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { itemId } = req.params;

        const item = await Item.findById(itemId);

        if (!item) {
            const error = new Error(i18n.t("Error_ItemDoesntExist"));
            return res.status(404).json({ error: error.message });
        }

        req.item = item;

        next();

    } catch (error) {
        return res.status(500).json({ error: i18n.t("Error_TryAgain") });
    }

}

export const itemBelongsToItemCollection = async (req: Request, res: Response, next: NextFunction) => {

    if (req.itemCollection._id.toString() !== req.item.itemCollection.toString()) {
        const error = new Error(i18n.t("Error_InvalidAction"));
        return res.status(403).json({ error: error.message });
    }

    next();

}