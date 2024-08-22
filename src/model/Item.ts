import mongoose, { Document, Schema, Types } from "mongoose";
import Comment from "./Comment";
import Like from "./Like";

export interface ICustomFieldValue {
    fieldName: string;
    value: string | number | boolean | Date;
}

export interface I_Item extends Document {
    itemName: string;
    description?: string;
    itemCollection: Types.ObjectId,
    image: string;
    comments: Types.ObjectId[];
    likes: Types.ObjectId[];
    customFields?: ICustomFieldValue[];
}

const itemSchema: Schema = new Schema({
    itemName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    itemCollection: {
        type: Types.ObjectId,
        ref: 'ItemCollection',
    },
    image: {
        type: String,
    },
    comments: [
        {
            type: Types.ObjectId,
            ref: 'Comment',
        }
    ],
    likes: [
        {
            type: Types.ObjectId,
            ref: 'Like'
        }
    ],
    customFields: [{
        fieldName: {
            type: String,
            required: true
        },
        value: Schema.Types.Mixed,
    }]
}, { timestamps: true });
itemSchema.index({ likes: -1 });

itemSchema.pre('deleteOne', { document: true }, async function () {
    const itemId = this._id;
    if (!itemId) return;

    await Promise.allSettled([Comment.deleteMany({ item: itemId }), Like.deleteMany({ item: itemId })]);
});

const Item = mongoose.model<I_Item>('Item', itemSchema);

export default Item;