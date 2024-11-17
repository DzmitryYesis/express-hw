import {commentsCollection, TComment, TCommentDB} from "../../db";
import {ObjectId, OptionalId} from "mongodb";
import {TInputComment} from "../types";

export const commentsRepository = {
    async getCommentById(id: string): Promise<TComment | null> {
        const comment = await commentsCollection.findOne({_id: new ObjectId(id)});

        if (comment) {
            return {
                id: comment._id.toString(),
                content: comment.content,
                commentatorInfo: comment.commentatorInfo,
                createdAt: comment.createdAt,
            }
        }

        return null
    },
    async createComment(data: Omit<TCommentDB, '_id'>): Promise<TComment> {
        //TODO fix type problem
        // @ts-ignore
        const result = await commentsCollection.insertOne(data as OptionalId<TCommentDB>);

        return {
            id: result.insertedId.toString(),
            content: data.content,
            commentatorInfo: data.commentatorInfo,
            createdAt: data.createdAt
        };
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