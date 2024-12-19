import {logRequestsCollection, TLogRequestsDB} from "../../db";

export const logRequestsRepository = {
    async addLogRequest(data: Omit<TLogRequestsDB, '_id'>) {
        const result = await logRequestsCollection.insertOne({...data} as TLogRequestsDB);

        return result.insertedId.toString();
    },
    async countLogRequest(data: Omit<TLogRequestsDB, '_id'>) {
        return await logRequestsCollection.countDocuments({
            ip: data.ip,
            url: data.url,
            date: {$gte: data.date},
        })
    }
}