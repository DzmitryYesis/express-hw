import {ObjectId} from "mongodb";

export type TBlogDB = {
    _id: ObjectId,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export type TPostDB = {
    _id: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
}

export type TUserDB = {
    _id: ObjectId,
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

export type TCommentDB = {
    _id: ObjectId,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string,
    },
    postId: string,
    createdAt: string,
}