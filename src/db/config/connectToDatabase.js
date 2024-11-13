import { MongoClient } from 'mongodb';

const url = process.env.MONGODB_URL;

export async function connectToDatabase() {
    try {
        const client = await MongoClient.connect(url);
        const db = client.db('scaledb'); // Use your actual database name
        return { client, db };
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error; // Re-throw to allow proper error handling in your component or API route
    }
}

export default async function handler(req, res) {
    // ... your handler logic, possibly using connectToDatabase() ...

    // Close the MongoDB connection after handling the request
    const { client } = await connectToDatabase();
    await client.close();
}
