import mongoose, { Schema, Types } from "mongoose";

export interface IComment {
    item: Types.ObjectId;
    author: Types.ObjectId;
    comment: string;
};

const commentSchema: Schema = new Schema({
    item: {
        type: Types.ObjectId,
        ref: 'Item',
        required: true,
    },
    author: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    },
    comment: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const Comment = mongoose.model<IComment>('Comment', commentSchema);

export default Comment;