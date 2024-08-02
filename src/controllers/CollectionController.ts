import { Request, Response, NextFunction } from 'express';
import Collection from '../model/Collection';

class CollectionController {

    static createCollection = async (req: Request, res: Response) => {
        const collection = new Collection(req.body);
        collection.owner = req.user.id;

        try {
            await collection.save();
            res.send('Collection created successfully');
        } catch (error) {
            console.log(error);
        }
    }

    static getAllCollections = async (req: Request, res: Response) => {
        try {
            const collections = await Collection.find({});
            res.json(collections);
        } catch (error) {
            console.log(error);
        }
    }

}

export default CollectionController;