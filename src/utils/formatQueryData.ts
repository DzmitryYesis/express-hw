import {
    TBlogsQuery,
    TCommentsQuery,
    TPostsQuery,
    TUsersQuery
} from "../types";

export const formatQueryBlogsData = (data: TBlogsQuery): TBlogsQuery => {
    const defaultQuery = {
        searchNameTerm: null,
        sortBy: "createdAt",
        sortDirection: 'desc',
        pageNumber: '1',
        pageSize: '10'
    } as TBlogsQuery;

    return {...defaultQuery, ...data};
}

export const formatQueryPostsData = (data: TPostsQuery): TPostsQuery => {
    const defaultQuery = {
        sortBy: "createdAt",
        sortDirection: 'desc',
        pageNumber: '1',
        pageSize: '10'
    } as TPostsQuery;

    return {...defaultQuery, ...data};
}

export const formatQueryUsersData = (data: TUsersQuery): TUsersQuery => {
    const defaultQuery = {
        searchLoginTerm: null,
        searchEmailTerm: null,
        sortBy: "createdAt",
        sortDirection: 'desc',
        pageNumber: '1',
        pageSize: '10'
    } as TUsersQuery;

    return {...defaultQuery, ...data};
}

export const formatQueryCommentsData = (data: TCommentsQuery): TCommentsQuery => {
    const defaultQuery = {
        sortBy: "createdAt",
        sortDirection: 'desc',
        pageNumber: '1',
        pageSize: '10'
    } as TCommentsQuery;

    return {...defaultQuery, ...data};
}