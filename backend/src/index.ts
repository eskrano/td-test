import mongoose, { mongo } from 'mongoose';
import app from './app';
import dotenv from 'dotenv';


dotenv.config();

const port = process.env.PORT || 3000;
const mongo_uri = process.env.MONGO_URI || 'mongodb://localhost:27017';

console.log(`Starting app...`);

mongoose.connect(mongo_uri, {
    socketTimeoutMS: 10_000,
}).then(() => {
    console.log(`Connected to MongoDB at ${mongo_uri}`);

    console.log(`Starting HTTP server...`);

    app.listen(port, () => {
        console.log(`> Server is listening on port ${port}`);
    });
}).catch((err) => {
    console.error(`Error connecting to MongoDB: ${err}`);
    process.exit(1);
});