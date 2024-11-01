import {TBlog} from "../../db";
import {TInputBlog} from "./types";
import {blogsRepository} from "./blogs-repository";

export const blogsService = {
    async getBlogs(): Promise<TBlog[]> {
        return await blogsRepository.getBlogs();

    },
    async getBlogById(id: string): Promise<TBlog | null> {
        return await blogsRepository.getBlogById(id);

    },
    async createBlog(data: TInputBlog): Promise<TBlog> {
        const newBlog: Omit<TBlog, 'id'> = {
            createdAt: new Date().toISOString(),
            isMembership: false,
            ...data
        }

        return await blogsRepository.createBlog(newBlog);
    },
    async updateBlogById(id: string, data: TInputBlog): Promise<boolean> {
        return await blogsRepository.updateBlogById(id, data);
    },
    async deleteBlog(id: string): Promise<boolean> {
        return await blogsRepository.deleteBlog(id);
    }
}