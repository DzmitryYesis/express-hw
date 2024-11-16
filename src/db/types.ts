import {ObjectId} from "mongodb";

export type TBlog = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export type TPost = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
}

export type TUser = {
    id: string,
    login: string,
    email: string,
    createdAt: string
}

export type TUserDB = {
    _id: ObjectId,
    login: string,
    email: string,
    createdAt: string
    passwordHash: string,
    salt: string,
}