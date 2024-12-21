import {ObjectId} from "mongodb";
import {TComment} from "../../types";
import {CommentModel} from "../../db/models";

export const queryCommentsRepository = {
    async getCommentById(id: string): Promise<TComment | null> {
        const comment = await CommentModel.findOne({_id: new ObjectId(id)});

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