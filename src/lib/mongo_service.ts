import { Collection, Db, MongoClient, ObjectId } from 'mongodb';

let database: Db;

export async function collection(categoryName: string): Promise<Collection<Document>> {
	return database.collection(categoryName);
}

export async function categoryOf(item_id: string): Promise<Collection | null> {
	const collections = await database.listCollections().toArray();
	for (const collectionInfo of collections) {
		const collection = database.collection(collectionInfo.name);
		if (await collection.findOne({ _id: new ObjectId(item_id) })) return collection;
	}

	return null;
}

export async function getCategoriesList() {
	return (await database.listCollections().toArray()).map((collectionInfo) => collectionInfo.name);
}

export async function connect() {
	const uri = 'mongodb://localhost:27017/';
	const client = new MongoClient(uri);
	database = client.db('shop');
}
