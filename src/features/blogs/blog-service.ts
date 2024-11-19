import {blogsRepository} from "../blogs";
import {postsRepository} from '../posts'
import {TBlog, TInputBlog, TInputPost, TPost} from "../../types";
import {TBlogDB} from "../../db";

export const blogsService = {
    async findBlogById(blogId: string): Promise<TBlogDB | null> {
       return blogsRepository.findBlogById(blogId);
    },
    async createBlog(data: TInputBlog): Promise<string> {
        const newBlog: Omit<TBlog, 'id'> = {
            createdAt: new Date().toISOString(),
            isMembership: false,
            ...data
        }

        return await blogsRepository.createBlog(newBlog);
    },
    async createPostForBlog(blog: TBlogDB, data: Omit<TInputPost, 'blogId'>): Promise<string> {
        const newPost: Omit<TPost, 'id'> = {
            blogName: blog.name,
            blogId: blog._id.toString(),
            createdAt: new Date().toISOString(),
            ...data
        }

        return await postsRepository.createPost(newPost);
    },
    async updateBlogById(id: string, data: TInputBlog): Promise<boolean> {
        return await blogsRepository.updateBlogById(id, data);
    },
    async deleteBlog(id: string): Promise<boolean> {
        return await blogsRepository.deleteBlog(id);
    }
}