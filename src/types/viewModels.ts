import {LikeStatusEnum} from "../constants";

export type TBlog = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export type TLikeInfo = {
    addedAt: string,
    userId: string,
    login: string
}

export type TExtendedLikesInfo = {
    likesCount: number,
    dislikesCount: number,
    myStatus: LikeStatusEnum,
    newestLikes: TLikeInfo[]
}

export type TPost = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: TExtendedLikesInfo
}

export type TUser = {
    id: string,
    login: string,
    email: string,
    createdAt: string
}

export type TLoginUser = {
    accessToken: string
};

export type TPersonalData = {
    email: string,
    login: string,
    userId: string,
}

export type TCommentLikeInfo = {
    likesCount: number,
    dislikesCount: number,
    myStatus: LikeStatusEnum,
}

export type TComment = {
    id: string,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: string,
    likesInfo: TCommentLikeInfo
}

export type TDevice = {
    ip: string,
    title: string,
    lastActiveDate: string,
    deviceId: string
}