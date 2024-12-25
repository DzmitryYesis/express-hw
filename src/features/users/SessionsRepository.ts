import {TSessionsDB, SessionModel} from "../../db";
import {ObjectId} from "mongodb";

export class SessionsRepository {
    async addSession(data: Omit<TSessionsDB, '_id'>): Promise<string> {
        const result = await SessionModel.create({...data} as TSessionsDB);

        return result._id.toString();
    }

    async findSession(deviceId: string, iat: number): Promise<TSessionsDB | null> {
        return SessionModel.findOne({deviceId, iat});
    }

    async findSessionByDeviceId(deviceId: string): Promise<TSessionsDB | null> {
        return SessionModel.findOne({deviceId});
    }

    async updateSessionData(data: TSessionsDB): Promise<boolean> {
        const result = await SessionModel.updateOne({_id: data._id}, {$set: {...data}});

        return result.matchedCount === 1
    }

    async deleteSessionById(deviceId: string): Promise<boolean> {
        const result = await SessionModel.deleteOne({deviceId})

        return result.deletedCount === 1
    }

    async deleteSessionByDeviceIdAndIat(deviceId: string, iat: number): Promise<number> {
        const result = await SessionModel.deleteOne({deviceId, iat})
        return result.deletedCount;
    }

    async deleteSessionsExcludeCurrent(deviceId: string, userId: string): Promise<boolean> {
        const result = await SessionModel.deleteMany({userId: new ObjectId(userId), deviceId: {$ne: deviceId}});

        return result.deletedCount > 0;
    }
}