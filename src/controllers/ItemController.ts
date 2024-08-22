import { Request, Response } from 'express';
import Item, { I_Item, ICustomFieldValue } from '../model/Item';
import i18n from '../config/i18n';
import { ICustomField } from '../model/ItemCollection';
interface CustomField {
    fieldName: string;
    value: any;
}

const convertFieldValue = (value: any, fieldType: string) => {
    switch (fieldType) {
        case 'string':
            return String(value);
        case 'number':
            const num = Number(value);
            if (isNaN(num)) throw new Error('Invalid number');
            return num;
        case 'boolean':
            if (typeof value === 'string') {
                if (value.toLowerCase() === 'true') return true;
                if (value.toLowerCase() === 'false') return false;
            }
            if (typeof value === 'boolean') return value;
        case 'date':
            const date = new Date(value);
            if (isNaN(date.getTime())) throw new Error('Invalid date');
            return date;
        default:
            throw new Error('Invalid field type');
    }
};

function updateItemDataCustomFields(itemData: { customFields?: CustomField[] }, collectionFields: ICustomField[], customFields: CustomField[]) {
    itemData.customFields = [];

    const customFieldsMap = new Map<string, CustomField>(
        customFields.map(field => [field.fieldName, field])
    );

    const errors = collectionFields.reduce((acc: string[], collectionField) => {
        const { fieldName, fieldType } = collectionField;
        const customField = customFieldsMap.get(fieldName);

        if (!customField) {
            acc.push(`${fieldName} es un campo obligatorio y no fue proporcionado.`);
        } else {
            try {
                const convertedValue = convertFieldValue(customField.value, fieldType);
                itemData.customFields.push({ fieldName, value: convertedValue });
            } catch (error) {
                acc.push(`Valor inválido para el campo ${fieldName}: ${error.message}`);
            }
        }

        return acc;
    }, []);

    if (errors.length > 0) {
        return { error: errors.join(' ') };
    }

    return { success: true };
}
class ItemController {

    static createItem = async (req: Request, res: Response) => {
        try {
            const { itemCollection, body } = req;
            const collectionFields = itemCollection.customFields;
            const itemData = { ...body };
            const result = updateItemDataCustomFields(itemData, collectionFields, itemData.customFields);
            console.log(itemData);
            if (result?.error) {
                return res.status(500).json({ error: result.error });
            }

            const item = new Item(itemData);
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

            const result = updateItemDataCustomFields(req.item, req.itemCollection.customFields, req.body.customFields);
            if (result?.error) {
                return res.status(400).json({ error: result.error });
            }

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