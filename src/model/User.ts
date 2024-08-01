import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    isBlocked: boolean;
    isAdmin: boolean;
}

const userSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true
    },
    isBlocked: {
        type: Boolean,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
    },
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;