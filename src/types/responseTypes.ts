export type TResponseWithPagination<T> = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: T
}