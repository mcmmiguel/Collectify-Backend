import mongoose, { Document, Schema, Types, ObjectId } from 'mongoose';

export interface ILike extends Document {
    item: Types.ObjectId;
    author: Types.ObjectId;
}

const likeSchema: Schema = new Schema({
    item: {
        type: Types.ObjectId,
        ref: 'Item',
        required: true,
    },
    author: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });

const Like = mongoose.model<ILike>('Like', likeSchema);

export default Like;