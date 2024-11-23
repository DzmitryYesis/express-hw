import {commentsCollection, TCommentDB} from "../../db";
import {ObjectId} from "mongodb";
import {TInputComment} from "../../types";

export const commentsRepository = {
    async createComment(data: Omit<TCommentDB, '_id'>): Promise<string> {
        const result = await commentsCollection.insertOne({...data} as TCommentDB);

        return result.insertedId.toString();
    },
    async findCommentById(id: string): Promise<TCommentDB | null> {
        return await commentsCollection.findOne({_id: new ObjectId(id)});
    },
    async updateCommentById(id: string, data: TInputComment): Promise<boolean> {
        const result = await commentsCollection.updateOne({_id: new ObjectId(id)}, {$set: {...data}})

        return result.matchedCount === 1
    },
    async deleteCommentById(id: string): Promise<boolean> {
        const result = await commentsCollection.deleteOne({_id: new ObjectId(id)})

        return result.deletedCount === 1
    }
}