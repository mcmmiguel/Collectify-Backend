import mongoose, { Document, PopulatedDoc, Schema, Types } from "mongoose";

export interface ICategory {
    categoryName: string;
};

const categorySchema: Schema = new Schema({
    categoryName: {
        type: String,
        required: true,
    }
});

export const Category = mongoose.model<ICategory>('Category', categorySchema);