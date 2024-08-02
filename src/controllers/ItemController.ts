import { Request, Response } from 'express';
import Item, { I_Item } from '../model/Item';

class ItemController {

    static createItem = async (req: Request, res: Response) => {
        try {
            const item = new Item(req.body);
            item.itemCollection = req.itemCollection.id;
            req.itemCollection.items.push(item.id);

            await Promise.allSettled([item.save(), req.itemCollection.save()]);
            res.send('Item created successfully.');
        } catch (error) {
            res.status(500).json({ error: 'There was an error' });
        }
    }

    static getAllItemsFromCollection = async (req: Request, res: Response) => {
        try {
            const items = await Item.find({ itemCollection: req.itemCollection.id }).populate('itemCollection');
            res.json(items);
        } catch (error) {
            res.status(500).json({ error: 'There was an error' });
        }
    }

    static getItemById = async (req: Request, res: Response) => {
        try {
            const item = req.item;
            res.json(item);
        } catch (error) {
            res.status(500).json({ error: 'There was an error' });
        }
    }

    static updateItem = async (req: Request, res: Response) => {
        try {
            req.item.itemName = req.body.itemName;
            req.item.description = req.body.description ?? req.item.description;
            req.item.image = req.body.image ?? req.item.image;

            await req.item.save();

            res.send('Item updated successfully');
        } catch (error) {
            res.status(500).json({ error: 'There was an error' });
        }
    }

    static deleteItem = async (req: Request, res: Response) => {
        try {
            req.itemCollection.items = req.itemCollection.items.filter(item => item.toString() !== req.item._id.toString());
            await Promise.allSettled([req.item.deleteOne(), req.itemCollection.save()]);
            res.send('Item deleted successfully');
        } catch (error) {
            res.status(500).json({ error: 'There was an error' });
        }
    }

}

export default ItemController;