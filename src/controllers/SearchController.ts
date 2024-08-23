import { Request, Response } from 'express'
import Item from '../model/Item';
import i18n from '../config/i18n';

class SearchController {
    static searchItems = async (req: Request, res: Response) => {
        const searchQuery = req.query.q as string;

        if (!searchQuery.trim()) {
            return res.status(400).json({ error: 'El término de búsqueda es requerido' });
        }

        try {
            const results = await Item.find({
                $or: [
                    { itemName: { $regex: searchQuery, $options: 'i' } },
                    { description: { $regex: searchQuery, $options: 'i' } }
                ]
            }).exec();

            res.json(results);
        } catch (err) {
            res.status(500).json({ error: i18n.t("Error_TryAgain") });
        }
    }
}

export default SearchController;