export type TInputBlog = {
    name: string;
    description: string;
    websiteUrl: string;
}

export type TInputPost = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}

export type TOutPutErrorsType = {
    errorsMessages: TErrorMessage[]
}

export type TErrorMessage = {
    message: string,
    field: string
}