import {TBlog, TComment, TPost, TUser} from "./viewModels";

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

export type TUsersQuery = {
    searchLoginTerm: string | null;
    searchEmailTerm: string | null;
    sortBy: keyof TUser;
    sortDirection: 'asc' | 'desc';
    pageNumber: string;
    pageSize: string;
}

export type TCommentsQuery = {
    sortBy: keyof TComment;
    sortDirection: 'asc' | 'desc';
    pageNumber: string;
    pageSize: string;
}