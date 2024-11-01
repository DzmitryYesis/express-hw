import {TPost} from "../../db";
import {TInputPost} from "../blogs/types";
import {postsRepository} from "./posts-repository";
import {blogsRepository} from "../blogs";

export const postsService = {
    async getPosts(): Promise<TPost[]> {
        return await postsRepository.getPosts();
    },
    async getPostById(id: string): Promise<TPost | null> {
        return await postsRepository.getPostById(id);
    },
    async createPost(data: TInputPost): Promise<TPost> {
        const blog = await blogsRepository.getBlogById(data.blogId);

        if (blog) {
            const newPost: Omit<TPost, 'id'> = {
                blogName: blog.name,
                createdAt: new Date().toISOString(),
                ...data
            }

            return await postsRepository.createPost(newPost);
        }

        throw new Error('Oops!')
    },
    async updatePostById(id: string, data: TInputPost): Promise<boolean> {
        return await postsRepository.updatePostById(id, data)
    },
    async deletePost(id: string): Promise<boolean> {
        return await postsRepository.deletePost(id)
    }
}