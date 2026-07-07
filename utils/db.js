import { MongoClient, ObjectId } from 'mongodb';

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 27017;
const database = process.env.DB_DATABASE || 'dead_drop';

class DBClient {
  constructor() {
    const url = `mongodb://${host}:${port}`;
    this.client = new MongoClient(url);
    this.client.connect();
    this.db = this.client.db(database);
  }

  usersCollection() {
    return this.db.collection('users');
  }

  dropsCollection() {
    return this.db.collection('drops');
  }

  getObjectId(id) {
    return new ObjectId(id);
  }
}
const dbClient = new DBClient();
export default dbClient;
