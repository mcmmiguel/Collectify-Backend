import { Request, Response } from 'express';
import Item, { I_Item } from '../model/Item';
import i18n from '../config/i18n';

class ItemController {

    static createItem = async (req: Request, res: Response) => {
        try {
            const item = new Item(req.body);
            item.itemCollection = req.itemCollection.id;
            req.itemCollection.items.push(item.id);

            await Promise.allSettled([item.save(), req.itemCollection.save()]);
            res.send(i18n.t("Success_CreateItem"));
        } catch (error) {
            res.status(500).json({ error: i18n.t("Error_TryAgain") });
        }
    }

    static getLatestItems = async (req: Request, res: Response) => {
        try {
            const items = await Item.find({})
                .sort({ createdAt: -1 })
                .populate({
                    path: 'itemCollection',
                    select: 'owner collectionName',
                    populate: {
                        path: 'owner',
                        select: 'name'
                    }
                })
                .limit(10);

            res.json(items);
        } catch (error) {
            res.status(500).json({ error: i18n.t("Error_TryAgain") });
        }
    }

    static getMostLikedItems = async (req: Request, res: Response) => {
        try {
            const items = await Item.find({})
                .sort({ likes: -1 })
                .populate({
                    path: 'itemCollection',
                    select: 'owner collectionName',
                    populate: {
                        path: 'owner',
                        select: 'name'
                    }
                })
                .limit(10);

            res.json(items);
        } catch (error) {
            res.status(500).json({ error: i18n.t("Error_TryAgain") });
        }
    }

    static getAllItemsFromCollection = async (req: Request, res: Response) => {
        try {
            const items = await Item.find({ itemCollection: req.itemCollection.id }).populate('itemCollection');
            res.json(items);
        } catch (error) {
            res.status(500).json({ error: i18n.t("Error_TryAgain") });
        }
    }

    static getItemById = async (req: Request, res: Response) => {
        try {
            const item = await Item.findById(req.item.id).populate('comments').populate('likes');
            res.json(item);
        } catch (error) {
            res.status(500).json({ error: i18n.t("Error_TryAgain") });
        }
    }

    static updateItem = async (req: Request, res: Response) => {
        try {
            req.item.itemName = req.body.itemName;
            req.item.description = req.body.description ?? req.item.description;
            req.item.image = req.body.image ?? req.item.image;

            await req.item.save();

            res.send(i18n.t("Success_UpdateItem"));
        } catch (error) {
            res.status(500).json({ error: i18n.t("Error_TryAgain") });
        }
    }

    static deleteItem = async (req: Request, res: Response) => {
        try {
            req.itemCollection.items = req.itemCollection.items.filter(item => item.toString() !== req.item._id.toString());
            await Promise.allSettled([req.item.deleteOne(), req.itemCollection.save()]);
            res.send(i18n.t("Success_DeleteItem"));
        } catch (error) {
            res.status(500).json({ error: i18n.t("Error_TryAgain") });
        }
    }

}

export default ItemController;