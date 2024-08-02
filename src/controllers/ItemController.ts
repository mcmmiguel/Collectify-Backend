import { Request, Response } from 'express';
import Item from '../model/Item';

class ItemController {

    static createItem = async (req: Request, res: Response) => {
        try {
            const item = new Item(req.body);
            item.itemCollection = req.itemCollection.id;
            req.itemCollection.items.push(item.id);

            await Promise.allSettled([item.save(), req.itemCollection.save()]);
            res.send('Item created successfully.');
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }

    static getAllItemsFromCollection = async (req: Request, res: Response) => {
        try {
            const items = await Item.find({ itemCollection: req.itemCollection.id }).populate('itemCollection');
            res.json(items);
        } catch (error) {
            console.log(error);
        }
    }

}

export default ItemController;