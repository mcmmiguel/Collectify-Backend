import Item from "../model/Item";

import mongoose from 'mongoose';

const createTextIndex = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        await Item.collection.createIndex({ itemName: 'text', description: 'text' });
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

createTextIndex();