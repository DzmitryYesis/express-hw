import {SETTINGS} from "../../src/settings";
import {TBlog, TInputBlog, TInputPost, TPost} from "../../src/types";
import {authBasic, req} from "./test-helper";

export const invalidBlogId = '674c1117e773331c44445554'

export const createBlogInputBody = (index: number) => ({
    name: `blog_${index}`,
    description: `description_${index}`,
    websiteUrl: `https://example${index}.com`
} as TInputBlog)

export const createPostForBlogByIdInputBody = (index: number) => ({
    title: `title_${index}`,
    content: `content_${index}`,
    shortDescription: `shortDescription_${index}`,
} as Omit<TInputPost, 'blogId'>)

export const createdBlog = async (index: number) => {
    const res = await req.post(SETTINGS.PATH.BLOGS)
        .set('authorization', `Basic ${authBasic}`)
        .send(createBlogInputBody(index))

    return res.body as TBlog;
}

export const createdPostForBlogByBlogId = async (index: number, blogId: string) => {
    const res = await req.post(`${SETTINGS.PATH.BLOGS}/${blogId}/posts`)
        .set('authorization', `Basic ${authBasic}`)
        .send(createPostForBlogByIdInputBody(index))

    return res.body as TPost;
}

export const createdBlogs = async (indexes: number) => {
    const blogsArray = [] as TBlog[];
    for (let i = 1; i <= indexes; i++) {
        const res = await req.post(SETTINGS.PATH.BLOGS)
            .set('authorization', `Basic ${authBasic}`)
            .send(createBlogInputBody(i))

        blogsArray.unshift(res.body as TBlog);
    }

    return blogsArray as TBlog[];
}

export const createdPostsForBlogByBlogId = async (indexes: number, blogId: string) => {
    const postsArray = [] as TPost[];
    for (let i = 1; i <= indexes; i++) {
        const res = await req.post(`${SETTINGS.PATH.BLOGS}/${blogId}/posts`)
            .set('authorization', `Basic ${authBasic}`)
            .send(createPostForBlogByIdInputBody(i))

        postsArray.unshift(res.body as TPost);
    }

    return postsArray as TPost[]
}