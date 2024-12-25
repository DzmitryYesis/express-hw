import {TCommentDB, CommentModel} from "../../db";
import {ObjectId} from "mongodb";
import {TInputComment} from "../../types";
import {injectable} from "inversify";

@injectable()
export class CommentsRepository {
    async createComment(data: Omit<TCommentDB, '_id'>): Promise<string> {
        const result = await CommentModel.create({...data} as TCommentDB);

        return result._id.toString();
    }

    async findCommentById(id: string): Promise<TCommentDB | null> {
        return CommentModel.findOne({_id: new ObjectId(id)});
    }

    async updateCommentById(id: string, data: TInputComment): Promise<boolean> {
        const result = await CommentModel.updateOne({_id: new ObjectId(id)}, {$set: {...data}})

        return result.matchedCount === 1
    }

    async addValueToLikesOrDislikesInfo(commentId: ObjectId, field: 'likes' | 'dislikes', userId: string): Promise<boolean> {
        const result = await CommentModel.updateOne({_id: commentId}, {$addToSet: {[`likesInfo.${field}`]: userId}});

        return result.matchedCount === 1
    }

    async deleteValueFromLikesOrDislikesInfo(commentId: ObjectId, field: 'likes' | 'dislikes', userId: string): Promise<boolean> {
        const result = await CommentModel.updateOne({_id: commentId}, {$pull: {[`likesInfo.${field}`]: userId}});

        return result.matchedCount === 1
    }

    async deleteCommentById(id: string): Promise<boolean> {
        const result = await CommentModel.deleteOne({_id: new ObjectId(id)})

        return result.deletedCount === 1
    }
}