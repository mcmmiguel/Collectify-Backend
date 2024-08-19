import { Request, Response } from 'express';
import { Category } from '../model/Category';


class CategoryController {
    static getCategories = async (req: Request, res: Response) => {
        try {
            const categories = await Category.find();
            return res.json(categories);
        } catch (error) {
            res.status(500).json({ error: 'There was an error. Try again later.' });
        }
    }

}

export default CategoryController;