import {TLikesCommentInfoDB} from "../db";
import {LikeStatusEnum} from "../constants";

export const getUserLikeStatus = (userId: string | null, likesInfo: TLikesCommentInfoDB) => {
    if (userId && likesInfo.likes.includes(userId)) {
        return LikeStatusEnum.LIKE
    }

    if (userId && likesInfo.dislikes.includes(userId)) {
        return LikeStatusEnum.DISLIKE
    }

    return LikeStatusEnum.NONE
}