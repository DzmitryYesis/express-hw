import {sessionsCollection, TSessionsDB} from "../../db";

export const sessionsRepository = {
    async addSession(data: Omit<TSessionsDB, '_id'>): Promise<string> {
        const result = await sessionsCollection.insertOne({...data} as TSessionsDB);

        return result.insertedId.toString();
    },
    async findSession(deviceId: string, iat: number): Promise<TSessionsDB | null> {
        return await sessionsCollection.findOne({deviceId, iat})
    },
    async deleteSession(deviceId: string, iat: number): Promise<number> {
        const result = await sessionsCollection.deleteOne({deviceId, iat})
        return result.deletedCount;
    },
    async updateSessionData(data: TSessionsDB): Promise<boolean> {
        const result = await sessionsCollection.updateOne({_id: data._id}, {$set: {...data}});

        return result.matchedCount === 1
    }
}