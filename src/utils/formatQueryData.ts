import {
    TBlogsQuery,
    TPostsQuery
} from "../features/types";

export const formatQueryData = (data: Partial<TBlogsQuery | TPostsQuery> ): TPostsQuery | TBlogsQuery => {
    const defaultQuery = {
        searchNameTerm: null,
        sortBy: "createdAt",
        sortDirection: 'desc',
        pageNumber: '1',
        pageSize: '10'
    } as TBlogsQuery;

    return {...defaultQuery, ...data};
}