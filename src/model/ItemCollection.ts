import mongoose, { Document, Schema, Types } from "mongoose";
import Item from "./Item";
import Comment from "./Comment";
import Like from "./Like";
export interface ICustomField {
    fieldName: string;
    fieldType: 'string' | 'number' | 'boolean' | 'date';
}

export interface IItemCollection extends Document {
    collectionName: string;
    description: string;
    category: Types.ObjectId;
    image: string;
    items: Types.ObjectId[];
    owner: Types.ObjectId;
    customFields: ICustomField[];
};

const itemCollectionSchema: Schema = new Schema({
    collectionName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    items: [
        {
            type: Types.ObjectId,
            ref: 'Item',
        }
    ],
    image: {
        type: String,
    },
    owner: {
        type: Types.ObjectId,
        ref: 'User',
    },
    customFields: [
        {
            fieldName: {
                type: String,
                required: true,
            },
            fieldType: {
                type: String,
                enum: ['string', 'number', 'boolean', 'date'],
                required: true,
            }
        }
    ],
}, { timestamps: true });

itemCollectionSchema.pre('deleteOne', { document: true }, async function () {
    const collectionId = this._id;

    if (!collectionId) return;

    const items = await Item.find({ collection: collectionId });

    for (const item of items) {
        await Promise.allSettled([Comment.deleteMany({ item: item._id }), Like.deleteMany({ item: item._id })]);
    }

    await Item.deleteMany({ collection: collectionId });
})

const ItemCollection = mongoose.model<IItemCollection>('ItemCollection', itemCollectionSchema);

export default ItemCollection;