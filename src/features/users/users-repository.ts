import {TUserDB, usersCollection} from "../../db";
import {ObjectId} from "mongodb";

export const usersRepository = {
    async createUser(data: Omit<TUserDB, '_id'>): Promise<string> {
        const result = await usersCollection.insertOne({...data} as TUserDB);

        return result.insertedId.toString()
    },
    async confirmUserAccount(id: ObjectId): Promise<boolean> {
        const result = await usersCollection.updateOne({_id: id}, {$set: {'emailConfirmation.isConfirmed': true}});

        return result.modifiedCount === 1
    },
    async updateUserConfirmationCode(id: ObjectId, code: string): Promise<boolean> {
        const result = await usersCollection.updateOne({_id: id}, {$set: {'emailConfirmation.confirmationCode': code}});

        return result.modifiedCount === 1
    },
    async deleteUser(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({_id: new ObjectId(id)})

        return result.deletedCount === 1
    },
    async findUserByLoginOrEmail(loginOrEmail: string): Promise<TUserDB | null> {
        return await usersCollection.findOne({$or: [{'accountData.email': loginOrEmail}, {'accountData.login': loginOrEmail}]})
    },
    async findUserByLogin(login: string): Promise<TUserDB | null> {
        return await usersCollection.findOne({'accountData.login': login});
    },
    async findUserByEmail(email: string): Promise<TUserDB | null> {
        return await usersCollection.findOne({'accountData.email': email});
    },
    async findUserById(id: string): Promise<TUserDB | null> {
        return await usersCollection.findOne({_id: new ObjectId(id)});
    },
    async findUserByConfirmationCode(code: string): Promise<TUserDB | null> {
        return await usersCollection.findOne({'emailConfirmation.confirmationCode': code});
    }
}