import {TPasswordRecoveryDB, PasswordRecoveryModel} from "../../db";
import {ObjectId} from "mongodb";

export class PasswordRecoveryRepository {
    async createPasswordRecovery(data: Omit<TPasswordRecoveryDB, '_id'>): Promise<string> {
        const result = await PasswordRecoveryModel.create({...data} as TPasswordRecoveryDB);

        return result._id.toString();
    }

    async findPasswordRecoveryCode(code: string): Promise<TPasswordRecoveryDB | null> {
        return PasswordRecoveryModel.findOne({recoveryCode: code})
    }

    async deletePasswordRecoveryObj (id: ObjectId): Promise<boolean> {
        const result = await PasswordRecoveryModel.deleteOne({_id: id})

        return result.deletedCount === 1
    }
}