import mongoose from "mongoose";
import {
    TBlogDB,
    TCommentDB,
    TLikePostInfoDB,
    TLogRequestsDB,
    TPasswordRecoveryDB,
    TPostDB,
    TSessionsDB,
    TUserDB
} from "./types";
import {WithId} from "mongodb";

export const BlogSchema = new mongoose.Schema<WithId<TBlogDB>>({
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    createdAt: {type: String, required: true},
    isMembership: {type: Boolean, required: true},
})

const LikesInfoDBSchema = new mongoose.Schema<TLikePostInfoDB>({
    userId: {type: String, required: true},
    addedAt: {type: String, required: true},
    login: {type: String, required: true},
})

export const PostSchema = new mongoose.Schema<WithId<TPostDB>>({
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true},
    extendedLikesInfo: {
        likes: {type: [LikesInfoDBSchema], required: true},
        dislikes: {type: [LikesInfoDBSchema], required: true}
    }
})

export const UserSchema = new mongoose.Schema<WithId<TUserDB>>({
    accountData: {
        login: {type: String, required: true},
        email: {type: String, required: true},
        createdAt: {type: String, required: true},
        passwordHash: {type: String, required: true},
        salt: {type: String, required: true},
    },
    emailConfirmation: {
        confirmationCode: {type: String, required: true},
        expirationDate: {type: Date, required: true},
        isConfirmed: {type: Boolean, required: true},
    }
})

export const CommentSchema = new mongoose.Schema<WithId<TCommentDB>>({
    content: {type: String, required: true},
    commentatorInfo: {
        userId: {type: String, required: true},
        userLogin: {type: String, required: true},
    },
    postId: {type: String, required: true},
    createdAt: {type: String, required: true},
    likesInfo: {
        likes: {type: [String], required: true},
        dislikes: {type: [String], required: true},
    }
})

export const SessionSchema = new mongoose.Schema<WithId<TSessionsDB>>({
    userId: {type: mongoose.Schema.Types.ObjectId, required: true},
    exp: {type: Number, required: true},
    iat: {type: Number, required: true},
    deviceId: {type: String, required: true},
    deviceName: {type: String, required: true},
    ip: {type: String, required: true},
})

export const LogRequestSchema = new mongoose.Schema<WithId<TLogRequestsDB>>({
    ip: {type: String, required: true},
    url: {type: String, required: true},
    date: {type: Date, required: true},
})

export const PasswordRecoverySchema = new mongoose.Schema<WithId<TPasswordRecoveryDB>>({
    userId: {type: mongoose.Schema.Types.ObjectId, required: true},
    recoveryCode: {type: String, required: true},
    expirationDate: {type: Date, required: true}
})