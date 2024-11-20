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

export type TLoginUser = {
    accessToken: string
};

export type TPersonalData = {
    email: string,
    login: string,
    userId: string,
}

export type TComment = {
    id: string,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: string
}