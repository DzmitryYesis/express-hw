import {TLikePostInfoDB} from "../db";
import {TLikeInfo} from "../types/viewModels";

export const getThreeLastLikes = (likes: TLikePostInfoDB[]): TLikeInfo[] => {
    return likes
        .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
        .slice(0, 3)
        .map(l => ({
            userId: l.userId,
            login: l.login,
            addedAt: l.addedAt,
        }))
}