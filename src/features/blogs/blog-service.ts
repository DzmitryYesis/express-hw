import {TBlog, TPost} from "../../db";
import {TResponseWithPagination, TInputBlog, TBlogsQuery, TPostsQuery, TInputPost} from "../types";
import {blogsRepository} from "./blogs-repository";
import {postsRepository} from "../posts";

export const blogsService = {
    async getBlogs(queryData: TBlogsQuery): Promise<TResponseWithPagination<TBlog[]>> {
        return await blogsRepository.getBlogs(queryData);
    },
    async getBlogById(id: string): Promise<TBlog | null> {
        return await blogsRepository.getBlogById(id);

    },
    async getPostForBlogById(id: string, queryData: TPostsQuery): Promise<TResponseWithPagination<TPost[]> | null> {
        const blog = await blogsRepository.getBlogById(id);
        if (blog) {
            return await blogsRepository.getPostForBlogById(id, queryData);
        }
        return blog;
    },
    async createBlog(data: TInputBlog): Promise<TBlog> {
        const newBlog: Omit<TBlog, 'id'> = {
            createdAt: new Date().toISOString(),
            isMembership: false,
            ...data
        }

        return await blogsRepository.createBlog(newBlog);
    },
    async createPostForBlog(id: string, data: Omit<TInputPost, 'blogId'>): Promise<TPost | null> {
        const blog = await blogsRepository.getBlogById(id);
        if (blog) {
            const newPost: Omit<TPost, 'id'> = {
                blogName: blog.name,
                blogId: id,
                createdAt: new Date().toISOString(),
                ...data
            }

            return await postsRepository.createPost(newPost);
        }

        return blog
    },
    async updateBlogById(id: string, data: TInputBlog): Promise<boolean> {
        return await blogsRepository.updateBlogById(id, data);
    },
    async deleteBlog(id: string): Promise<boolean> {
        return await blogsRepository.deleteBlog(id);
    }
}