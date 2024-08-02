import mongoose, { Schema, Types } from "mongoose";
import Comment from "./Comment";
import Like from "./Like";

export interface I_Item {
    itemName: string;
    description?: string;
    itemCollection: Types.ObjectId,
    image: string;
    comments: Types.ObjectId[];
    likes: Types.ObjectId[];
};

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
    ]
}, { timestamps: true });

itemSchema.pre('deleteOne', { document: true }, async function () {
    const itemId = this._id;
    if (!itemId) return;

    await Promise.allSettled([Comment.deleteMany({ item: itemId }), Like.deleteMany({ item: itemId })]);
})

const Item = mongoose.model<I_Item>('Item', itemSchema);

export default Item;