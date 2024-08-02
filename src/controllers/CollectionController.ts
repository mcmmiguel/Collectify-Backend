import { Request, Response, NextFunction } from 'express';
import ItemCollection from '../model/ItemCollection';

class CollectionController {

    static createCollection = async (req: Request, res: Response) => {
        const itemCollection = new ItemCollection(req.body);
        itemCollection.owner = req.user.id;

        try {
            await itemCollection.save();
            res.send('Collection created successfully');
        } catch (error) {
            console.log(error);
        }
    }

    static getAllCollections = async (req: Request, res: Response) => {
        try {
            const itemCollections = await ItemCollection.find({});
            res.json(itemCollections);
        } catch (error) {
            console.log(error);
        }
    }

    static getCollectionById = async (req: Request, res: Response) => {
        const { itemCollectionId } = req.params;
        try {
            const itemCollection = await ItemCollection.findById(itemCollectionId).populate('items');

            if (!itemCollection) {
                const error = new Error('The collection does not exist')
                res.status(404).json(error.message);
            }

            res.json(itemCollection);

        } catch (error) {
            console.log(error);
        }
    }

    static updateCollection = async (req: Request, res: Response) => {

        const { itemCollectionId } = req.params;

        try {
            const itemCollection = await ItemCollection.findById(itemCollectionId);

            if (itemCollection.owner.toString() !== req.user.id && !req.user.isAdmin) {
                const error = new Error('Not-valid action');
                res.status(404).json(error.message);
            }

            req.itemCollection.collectionName = req.body.collectionName;
            req.itemCollection.description = req.body.description;
            req.itemCollection.image = req.body.image;

            await req.itemCollection.save();

            res.send('Collection updated');
        } catch (error) {
            console.log(error);
        }
    }

}

export default CollectionController;