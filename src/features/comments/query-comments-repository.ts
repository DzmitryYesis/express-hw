import {commentsCollection} from "../../db";
import {ObjectId} from "mongodb";
import {TComment} from "../../types";

export const queryCommentsRepository = {
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
}