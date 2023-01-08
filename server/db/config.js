import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

async function connect() {
    const mongod = await MongoMemoryServer.create();
    const getURL = mongod.getUri();

    const db = await mongoose.connect(getURL);

    mongoose.set("strictQuery", true);
    console.log("Database connection");

    return db;
}