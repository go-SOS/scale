import { MongoClient } from 'mongodb';

const url = process.env.MONGODB_URL;
const dbName = 'scaledb';
const collectionName = 'counters';

let client;
let db;
let collection;

async function connectToDatabase() {
    if (!client) {
        client = await MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db = client.db(dbName);
        collection = db.collection(collectionName);
    }
}

const getNextSequenceValue = async (usersId, key, slug) => {
    await connectToDatabase();

    const query = { userId: usersId };
    if (slug) {
        query.projectSlug = slug;
    }

    const update = {
        $inc: { [key]: 1 },
    };

    const options = {
        returnDocument: 'after',  // Use 'after' to return the document after update is applied
        upsert: true,  // Create the document if it doesn't exist
    };

    const updatedDocument = await collection.findOneAndUpdate(query, update, options);

    console.log('updatedDocument ', key + updatedDocument[key]);

    return key + updatedDocument[key];
};

export default getNextSequenceValue;
