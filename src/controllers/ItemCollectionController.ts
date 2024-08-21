import { Request, Response, NextFunction } from 'express';
import ItemCollection from '../model/ItemCollection';
import i18n from '../config/i18n';

class CollectionController {

    static createCollection = async (req: Request, res: Response) => {
        const itemCollection = new ItemCollection(req.body);
        itemCollection.owner = req.user.id;

        try {
            await itemCollection.save();
            res.send(i18n.t("Success_CreateCollection"));
        } catch (error) {
            res.status(500).json({ error: i18n.t("Error_TryAgain") });
        }
    }

    static getAllCollections = async (req: Request, res: Response) => {
        try {
            const itemCollections = await ItemCollection.find({}).populate({ path: 'owner', select: 'name' }).populate('category');
            res.json(itemCollections);
        } catch (error) {
            res.status(500).json({ error: i18n.t("Error_TryAgain") });
        }
    }

    static getLargestCollections = async (req: Request, res: Response) => {
        try {
            const itemCollections = await ItemCollection.find({})
                .populate({ path: 'owner', select: 'name' })
                .populate('category');

            const sortedCollections = itemCollections.sort((a, b) => b.items.length - a.items.length).slice(0, 10);

            res.json(sortedCollections);
        } catch (error) {
            res.status(500).json({ error: i18n.t("Error_TryAgain") });
        }
    }

    static getCollectionById = async (req: Request, res: Response) => {
        const { itemCollectionId } = req.params;
        try {
            const itemCollection = await ItemCollection.findById(itemCollectionId).populate('items category').populate({
                path: 'owner',
                select: 'name _id'
            });

            if (!itemCollection) {
                const error = new Error(i18n.t("Error_CollectionDoesntExist"));
                return res.status(404).json({ error: error.message });
            }

            res.json(itemCollection);

        } catch (error) {
            res.status(500).json({ error: i18n.t("Error_TryAgain") });
        }
    }

    static getCollectionsByOwner = async (req: Request, res: Response) => {
        const { _id } = req.user;
        try {
            const itemCollections = await ItemCollection.find({ owner: _id }).populate('category').populate({ path: 'owner', select: 'name' });
            res.json(itemCollections);
        } catch (error) {
            res.status(500).json({ error: i18n.t("Error_TryAgain") });
        }
    }

    static updateCollection = async (req: Request, res: Response) => {
        try {
            req.itemCollection.collectionName = req.body.collectionName;
            req.itemCollection.description = req.body.description ?? req.itemCollection.description;
            req.itemCollection.category = req.body.category ?? req.itemCollection.category;
            req.itemCollection.image = req.body.image ?? req.itemCollection.image;

            await req.itemCollection.save();

            res.send(i18n.t("Success_UpdateCollection"));
        } catch (error) {
            res.status(500).json({ error: i18n.t("Error_TryAgain") });
        }
    }

    static deleteCollection = async (req: Request, res: Response) => {
        try {
            await req.itemCollection.deleteOne();
            res.send(i18n.t("Success_DeleteCollection"));
        } catch (error) {
            res.status(500).json({ error: i18n.t("Error_TryAgain") });
        }
    }

}

export default CollectionController;