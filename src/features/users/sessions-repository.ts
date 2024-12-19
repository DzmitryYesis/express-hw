import {sessionsCollection, TSessionsDB} from "../../db";
import {ObjectId} from "mongodb";

export const sessionsRepository = {
    async addSession(data: Omit<TSessionsDB, '_id'>): Promise<string> {
        const result = await sessionsCollection.insertOne({...data} as TSessionsDB);

        return result.insertedId.toString();
    },
    async findSession(deviceId: string, iat: number): Promise<TSessionsDB | null> {
        return await sessionsCollection.findOne({deviceId, iat})
    },
    async findSessionByDeviceId(deviceId: string): Promise<TSessionsDB | null> {
        return await sessionsCollection.findOne({deviceId});
    },
    async deleteSessionById(deviceId: string): Promise<boolean> {
        const result = await sessionsCollection.deleteOne({deviceId})

        return result.deletedCount === 1
    },
    async deleteSessionByDeviceIdAndIat(deviceId: string, iat: number): Promise<number> {
        const result = await sessionsCollection.deleteOne({deviceId, iat})
        return result.deletedCount;
    },
    async deleteSessionsExcludeCurrent(deviceId: string, userId: string): Promise<boolean> {
        const result = await sessionsCollection.deleteMany({userId: new ObjectId(userId), deviceId: {$ne: deviceId}});

        return result.deletedCount > 0;
    },
    async updateSessionData(data: TSessionsDB): Promise<boolean> {
        const result = await sessionsCollection.updateOne({_id: data._id}, {$set: {...data}});

        return result.matchedCount === 1
    }
}