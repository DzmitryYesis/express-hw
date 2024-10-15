export type TDataBase = {
    blogs: TBlog[],
    posts: TPost[]
}

export type TBlog = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string
}

export type TPost = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
}