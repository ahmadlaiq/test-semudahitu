import mongoose from 'mongoose';

import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI_PROD;

if (!MONGODB_URI) {
    throw new Error('Something went wrong with the database connection!');
} else {
    console.log('Database connection successful');
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = {
        conn: null,
        promise: null
    };
}

async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

export default connectToDatabase;