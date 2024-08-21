import { Request, Response } from 'express';
import { Category } from '../model/Category';
import i18n from '../config/i18n';

class CategoryController {
    static getCategories = async (req: Request, res: Response) => {
        try {
            const categories = await Category.find();
            const translatedCategories = categories.map(category => ({
                _id: category._id,
                categoryName: i18n.t(`categories.${category.categoryName}`)
            }));
            return res.json(translatedCategories);
        } catch (error) {
            res.status(500).json({ error: i18n.t("Error_TryAgain") });
        }
    }
}

export default CategoryController;