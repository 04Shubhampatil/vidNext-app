import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = global.mongoose;

const opts = {
    bufferCommands: true,
    maxPoolSize: 10,
};

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export  default async function mongoConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, opts).then(() => mongoose.connection);
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        throw new Error("MongoDB connection failed");
    }

    return cached.conn;
}
