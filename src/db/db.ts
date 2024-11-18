import {TBlogDB, TCommentDB, TPostDB, TUserDB} from './types';
import {MongoClient} from 'mongodb';
import {SETTINGS} from '../settings';
import dotenv from 'dotenv'

dotenv.config()

const mongoURI = process.env.MONGO_URL || SETTINGS.MONGO_URL

export const client: MongoClient = new MongoClient(mongoURI)
const db = client.db();

//TODO change type for db collection
export const blogsCollection = db.collection<TBlogDB>(SETTINGS.DB_COLLECTION_BLOGS_NAME);
export const postsCollection = db.collection<TPostDB>(SETTINGS.DB_COLLECTION_POSTS_NAME);
export const usersCollection = db.collection<TUserDB>(SETTINGS.DB_COLLECTION_USERS_NAME);
export const commentsCollection = db.collection<TCommentDB>(SETTINGS.DB_COLLECTION_COMMENTS_NAME);
// проверка подключения к бд
export const connectToDB = async () => {
    try {
        await client.connect()
        console.log(`connected to db: ${mongoURI}`)
        await client.db().command({ping: 1})
        return true
    } catch (e) {
        console.log(e)
        await client.close()
        return false
    }
}