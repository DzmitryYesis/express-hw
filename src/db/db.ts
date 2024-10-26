import {TBlog, TPost} from './types';
import {MongoClient} from 'mongodb';
import {SETTINGS} from '../settings';
import dotenv from 'dotenv'

dotenv.config()

const mongoURI = process.env.MONGO_URL || SETTINGS.MONGO_URL

export const client: MongoClient = new MongoClient(mongoURI)
const db = client.db();
export const blogsCollection = db.collection<TBlog>(SETTINGS.DB_COLLECTION_BLOGS_NAME);
export const postsCollection = db.collection<TPost>(SETTINGS.DB_COLLECTION_POSTS_NAME);

// проверка подключения к бд
export const connectToDB = async () => {
    try {
        await client.connect()
        console.log('connected to db')
        await client.db('incubator').command({ping: 1})
        return true
    } catch (e) {
        console.log(e)
        await client.close()
        return false
    }
}