import mongoose, { Document, PopulatedDoc, Schema, Types } from "mongoose";
import { IUser } from "./User";
import Item, { I_Item } from "./Item";
import Comment from "./Comment";
import Like from "./Like";

export interface ICollection extends Document {
    collectionName: string;
    description?: string;
    image: string;
    items: PopulatedDoc<I_Item & Document>;
    owner: PopulatedDoc<IUser & Document>;
};

const collectionSchema: Schema = new Schema({
    collectionName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
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

}, { timestamps: true });

collectionSchema.pre('deleteOne', { document: true }, async function () {
    const collectionId = this._id;

    if (!collectionId) return;

    const items = await Item.find({ collection: collectionId });

    for (const item of items) {
        await Promise.allSettled([Comment.deleteMany({ item: item._id }), Like.deleteMany({ item: item._id })]);
    }

    await Item.deleteMany({ collection: collectionId });
})

const Collection = mongoose.model<ICollection>('Collection', collectionSchema);

export default Collection;