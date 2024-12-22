import {TCommentDB} from "../../db";
import {ObjectId} from "mongodb";
import {TInputComment} from "../../types";
import {CommentModel} from "../../db/models";

export const commentsRepository = {
    async createComment(data: Omit<TCommentDB, '_id'>): Promise<string> {
        const result = await CommentModel.create({...data} as TCommentDB);

        return result._id.toString();
    },
    async findCommentById(id: string): Promise<TCommentDB | null> {
        return CommentModel.findOne({_id: new ObjectId(id)});
    },
    async updateCommentById(id: string, data: TInputComment): Promise<boolean> {
        const result = await CommentModel.updateOne({_id: new ObjectId(id)}, {$set: {...data}})

        return result.matchedCount === 1
    },
    async deleteCommentById(id: string): Promise<boolean> {
        const result = await CommentModel.deleteOne({_id: new ObjectId(id)})

        return result.deletedCount === 1
    }
}