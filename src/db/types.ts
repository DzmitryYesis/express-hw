import {ObjectId} from "mongodb";

export type TBlogDB = {
    _id: ObjectId;
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export type TLikeInfoDB = {
    addedAt: string,
    userId: string,
    login: string
}

export type TExtendedLikesInfoDB = {
    likes: TLikeInfoDB[],
    dislikes: TLikeInfoDB[]
}

export type TPostDB = {
    _id: ObjectId;
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: TExtendedLikesInfoDB
}

export type TUserDB = {
    _id: ObjectId;
    accountData: {
        login: string,
        email: string,
        createdAt: string
        passwordHash: string,
        salt: string,
    },
    emailConfirmation: {
        confirmationCode: string,
        expirationDate: Date,
        isConfirmed: boolean,
    }
}

export type TLikesInfoDB = {
    likes: string[],
    dislikes: string[],
}

export type TCommentDB = {
    _id: ObjectId;
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string,
    },
    postId: string,
    createdAt: string,
    likesInfo: TLikesInfoDB
}

export type TSessionsDB = {
    _id: ObjectId;
    userId: ObjectId,
    exp: number,
    iat: number,
    deviceId: string,
    deviceName: string
    ip: string,
}

export type TLogRequestsDB = {
    _id: ObjectId;
    ip: string,
    url: string
    date: Date
}

export type TPasswordRecoveryDB = {
    _id: ObjectId;
    userId: ObjectId,
    recoveryCode: string,
    expirationDate: Date,
}