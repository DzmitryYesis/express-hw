/*export const querySortBy = {
    blogs: Object.keys({} as TBlog) as (keyof TBlog)[],
    posts: Object.keys({} as TPost) as (keyof TPost)[],
}*/

export const querySortBy = {
    blogs: [
        "id",
        "name",
        "description",
        "websiteUrl",
        "createdAt",
        "isMembership"
    ],
    posts: [
        "id",
        "title",
        "shortDescription",
        "content",
        "blogId",
        "blogName",
        "createdAt"
    ],
}

