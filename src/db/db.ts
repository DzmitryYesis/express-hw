import {SETTINGS} from '../settings';
import dotenv from 'dotenv'
import * as mongoose from "mongoose";

dotenv.config()

const dbName = 'express_project'
const mongoURI = process.env.MONGO_URL || SETTINGS.MONGO_URL

// проверка подключения к бд
export const connectToDB = async () => {
    try {
        await mongoose.connect(`${mongoURI}/${dbName}`)
        console.log(`connected to db: ${mongoURI}/${dbName}`)
        return true
    } catch (e) {
        console.log(e)
        await mongoose.disconnect();
        return false
    }
}