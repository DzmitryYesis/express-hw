import {CommentsRepository} from "../comments";
import {TInputComment, TResultServiceObj} from "../../types";
import {TCommentDB} from "../../db";
import {createServiceResultObj} from "../../utils";
import {LikeStatusEnum} from "../../constants";

export class CommentsService {
    constructor(
        protected commentsRepository: CommentsRepository
    ) {}

    async findCommentById(id: string): Promise<TResultServiceObj<TCommentDB>> {
        const comment = await this.commentsRepository.findCommentById(id);
        if (comment) {
            return createServiceResultObj<TCommentDB>("SUCCESS", "OK", comment);
        }

        return createServiceResultObj("REJECT", "NOT_FOUND");
    }

    async updateCommentById(userId: string, id: string, data: TInputComment): Promise<TResultServiceObj> {
        const {result, status, data: findCommentByIdData} = await this.findCommentById(id);

        if (result === "SUCCESS") {
            if (findCommentByIdData!.commentatorInfo.userId === userId) {
                await this.commentsRepository.updateCommentById(id, data);

                return createServiceResultObj("SUCCESS", "NO_CONTENT");
            }

            return createServiceResultObj("REJECT", "FORBIDDEN")
        }

        return createServiceResultObj(result, status);
    }

    async likeComment(commentId: string, likeStatus: string, userId: string): Promise<TResultServiceObj> {
        const {result, data} = await this.findCommentById(commentId);

        if (result === "SUCCESS" && data) {
            const {_id, likesInfo: {likes, dislikes}} = data

            if (likeStatus === LikeStatusEnum.LIKE) {
                if (!likes.includes(userId) && !dislikes.includes(userId)) {
                    await this.commentsRepository.addValueToLikesInfo(_id, 'likes', userId);
                }
                if (!likes.includes(userId) && dislikes.includes(userId)) {
                    await this.commentsRepository.deleteValueFromLikesInfo(_id, 'dislikes', userId);
                    await this.commentsRepository.addValueToLikesInfo(_id, 'likes', userId);
                }

                return createServiceResultObj("SUCCESS", "NO_CONTENT");
            }

            if (likeStatus === LikeStatusEnum.DISLIKE) {
                if (!likes.includes(userId) && !dislikes.includes(userId)) {
                    await this.commentsRepository.addValueToLikesInfo(_id, 'dislikes', userId);
                }
                if (likes.includes(userId) && !dislikes.includes(userId)) {
                    await this.commentsRepository.deleteValueFromLikesInfo(_id, 'likes', userId);
                    await this.commentsRepository.addValueToLikesInfo(_id, 'dislikes', userId);
                }

                return createServiceResultObj("SUCCESS", "NO_CONTENT");
            }

            if (likeStatus === LikeStatusEnum.NONE) {
                if (likes.includes(userId)) {
                    await this.commentsRepository.deleteValueFromLikesInfo(_id, 'likes', userId);
                }

                if (dislikes.includes(userId)) {
                    await this.commentsRepository.deleteValueFromLikesInfo(_id, 'dislikes', userId);
                }

                return createServiceResultObj("SUCCESS", "NO_CONTENT");
            }
        }

        return createServiceResultObj("REJECT", "NOT_FOUND")
    }

    async deleteCommentById(userId: string, id: string): Promise<TResultServiceObj> {
        const {result, status, data} = await this.findCommentById(id);

        if (result === "SUCCESS") {
            if (data!.commentatorInfo.userId === userId) {
                await this.commentsRepository.deleteCommentById(id);

                return createServiceResultObj("SUCCESS", "NO_CONTENT");
            }

            return createServiceResultObj("REJECT", "FORBIDDEN")
        }

        return createServiceResultObj(result, status);
    }
}