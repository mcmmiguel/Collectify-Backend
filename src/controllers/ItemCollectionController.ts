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
            const itemCollections = await ItemCollection.find({}).populate({ path: 'owner', select: 'name' });
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
                return res.status(404).json({ error: error.message });
            }

            res.json(itemCollection);

        } catch (error) {
            console.log(error);
        }
    }

    static getCollectionsByOwner = async (req: Request, res: Response) => {
        const { _id } = req.user;
        try {
            const itemCollections = await ItemCollection.find({ owner: _id }).populate('items');
            res.json(itemCollections);
        } catch (error) {
            console.log(error);
        }
    }

    static updateCollection = async (req: Request, res: Response) => {
        try {
            req.itemCollection.collectionName = req.body.collectionName;
            req.itemCollection.description = req.body.description ?? req.itemCollection.description;
            req.itemCollection.category = req.body.category ?? req.itemCollection.category;
            req.itemCollection.image = req.body.image ?? req.itemCollection.image;

            await req.itemCollection.save();

            res.send('Collection updated');
        } catch (error) {
            console.log(error);
        }
    }

    static deleteCollection = async (req: Request, res: Response) => {
        try {
            await req.itemCollection.deleteOne();
            res.send('Collection deleted successfully.');
        } catch (error) {
            console.log(error);
        }
    }

}

export default CollectionController;