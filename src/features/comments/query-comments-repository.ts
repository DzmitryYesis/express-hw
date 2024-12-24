import {ObjectId} from "mongodb";
import {TComment} from "../../types";
import {CommentModel} from "../../db/models";
import {getUserLikeStatus} from "../../utils";

export const queryCommentsRepository = {
    async getCommentById(id: string, userId: string | null): Promise<TComment | null> {
        const comment = await CommentModel.findOne({_id: new ObjectId(id)});

        if (comment) {
            const userLikeStatus = getUserLikeStatus(userId, comment.likesInfo);

            return {
                id: comment._id.toString(),
                content: comment.content,
                commentatorInfo: comment.commentatorInfo,
                createdAt: comment.createdAt,
                likesInfo: {
                    likesCount: comment.likesInfo.likes.length,
                    dislikesCount: comment.likesInfo.dislikes.length,
                    myStatus: userLikeStatus
                }
            }
        }

        return null
    },
}