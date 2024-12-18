export type TInputBlog = {
    name: string;
    description: string;
    websiteUrl: string;
}

export type TInputPost = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
}

export type TInputUser = {
    login: string,
    password: string,
    email: string,
}

export type TInputLogin = {
    loginOrEmail: string,
    password: string,
}

export type TInputCode = {
    code: string,
}

export type TInputResendEmail = {
    email: string,
}

export type TInputComment = {
    content: string,
}