import {TUserDB, UserModel} from "../../db";
import {ObjectId} from "mongodb";

export class UsersRepository {
    async createUser(data: Omit<TUserDB, '_id'>): Promise<string> {
        const result = await UserModel.create({...data} as TUserDB);

        return result._id.toString()
    }

    async confirmUserAccount(id: ObjectId): Promise<boolean> {
        const result = await UserModel.updateOne({_id: id}, {$set: {'emailConfirmation.isConfirmed': true}});

        return result.modifiedCount === 1
    }

    async updateUserConfirmationCode(id: ObjectId, code: string): Promise<boolean> {
        const result = await UserModel.updateOne({_id: id}, {$set: {'emailConfirmation.confirmationCode': code}});

        return result.modifiedCount === 1
    }

    async updateUserPassword(id: ObjectId, passwordHash: string): Promise<boolean> {
        const result = await UserModel.updateOne({_id: id}, {$set: {'accountData.passwordHash': passwordHash}});

        return result.modifiedCount === 1
    }

    async findUserByLoginOrEmail(loginOrEmail: string): Promise<TUserDB | null> {
        return UserModel.findOne({$or: [{'accountData.email': loginOrEmail}, {'accountData.login': loginOrEmail}]});
    }

    async findUserByLogin(login: string): Promise<TUserDB | null> {
        return UserModel.findOne({'accountData.login': login});
    }

    async findUserByEmail(email: string): Promise<TUserDB | null> {
        return UserModel.findOne({'accountData.email': email});
    }

    async findUserById(id: string): Promise<TUserDB | null> {
        return UserModel.findOne({_id: new ObjectId(id)});
    }

    async findUserByConfirmationCode(code: string): Promise<TUserDB | null> {
        return UserModel.findOne({'emailConfirmation.confirmationCode': code});
    }

    async deleteUser(id: string): Promise<boolean> {
        const result = await UserModel.deleteOne({_id: new ObjectId(id)})

        return result.deletedCount === 1
    }

}