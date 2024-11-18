import {TUserDB, usersCollection} from "../../db";
import {ObjectId, OptionalId} from "mongodb";

export const usersRepository = {
    async createUser(data: Omit<TUserDB, '_id'>): Promise<string> {
        //TODO fix type problem
        // @ts-ignore
        const result = await usersCollection.insertOne(data as OptionalId<TUserDB>);

        return result.insertedId.toString()
    },
    async deleteUser(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({_id: new ObjectId(id)})

        return result.deletedCount === 1
    },
    async findUserByLoginOrEmail(loginOrEmail: string): Promise<TUserDB | null> {
        return await usersCollection.findOne({$or: [{email: loginOrEmail}, {login: loginOrEmail}]})
    },
    async findUserByLogin(login: string): Promise<TUserDB | null> {
        return await usersCollection.findOne({login: login});
    },
    async findUserByEmail(email: string): Promise<TUserDB | null> {
        return await usersCollection.findOne({email: email});
    }
}