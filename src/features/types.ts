import {TBlog, TPost} from "../db";

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

export type TBlogsQuery = {
    searchNameTerm: string | null;
    sortBy: keyof TBlog;
    sortDirection: 'asc' | 'desc';
    pageNumber: string;
    pageSize: string;
}

export type TPostsQuery = {
    sortBy: keyof TPost;
    sortDirection: 'asc' | 'desc';
    pageNumber: string;
    pageSize: string;
}

export type TResponseWithPagination<T> = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: T
}