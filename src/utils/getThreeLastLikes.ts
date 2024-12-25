import {TLikeInfoDB} from "../db";

export const getThreeLastLikes = (likes: TLikeInfoDB[]): TLikeInfoDB[] => {
    return likes
        .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
        .slice(0, 3);
}