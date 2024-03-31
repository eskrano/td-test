import mongoose from "mongoose";

export const dynamicSchema = new mongoose.Schema({}, { strict: false });

export const dynamicCsvModel = (collectionName: string) => {
    return mongoose.model(collectionName, dynamicSchema);
}