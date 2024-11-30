import {refreshTokenCollection, TRefreshTokenDB} from "../../db";

export const refreshTokenRepository = {
    async addRefreshToken(data: Omit<TRefreshTokenDB, '_id'>): Promise<string> {
        const result = await refreshTokenCollection.insertOne({...data} as TRefreshTokenDB);

        return result.insertedId.toString();
    },
    async findRefreshToken(refreshToken: string): Promise<TRefreshTokenDB | null> {
        return await refreshTokenCollection.findOne({refreshToken: refreshToken})
    },
    async updateRefreshTokenData(data: TRefreshTokenDB): Promise<boolean> {
        const result = await refreshTokenCollection.updateOne({_id: data._id}, {$set: {...data}});

        return result.matchedCount === 1
    }
}