import mongoose from "mongoose";
import colors from 'colors';

export async function connectDB() {
    try {
        const connection = await mongoose.connect(process.env.DATABASE_URL);
        const url = `${connection.connection.host}:${connection.connection.port}`;
        console.log(colors.cyan.bold(`MongoDB connected on: ${url}`));
    } catch (error) {
        colors.red.bold('Error connecting to the database');
        process.exit(1);
    }
}