import mongoose from "mongoose";
import dotenv from 'dotenv';
export const connectDataBase = () => {
    mongoose.set('strictQuery', true)
    mongoose.connect(process.env.MONGO_URL)
    .then((con) => console.log(`DataBase is Connected: ${con.connection.host}`))
    .catch((error) => console.log(`${error} did not connect`));
};