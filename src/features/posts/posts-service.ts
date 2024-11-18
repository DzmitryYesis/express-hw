import {TInputComment, TInputPost, TPost, TBlog} from "../../types";
import {TCommentDB} from "../../db";
import {postsRepository} from "./posts-repository";
import {queryUsersRepository} from "../users";
import {commentsRepository} from "../comments";

export const postsService = {
    async createPost(data: TInputPost, blog: TBlog): Promise<string> {
        const newPost: Omit<TPost, 'id'> = {
            blogName: blog.name,
            createdAt: new Date().toISOString(),
            ...data
        }

        return await postsRepository.createPost(newPost);
    },
    async createCommentForPost(id: string, data: TInputComment, userId: string): Promise<string> {
        const personalData = await queryUsersRepository.getUserById(userId);
        const newComment: Omit<TCommentDB, '_id'> = {
            commentatorInfo: {
                userId: personalData!.id,
                userLogin: personalData!.login,
            },
            createdAt: new Date().toISOString(),
            postId: id,
            ...data
        }

        return await commentsRepository.createComment(newComment);
    },
    async updatePostById(id: string, data: TInputPost): Promise<boolean> {
        return await postsRepository.updatePostById(id, data)
    },
    async deletePost(id: string): Promise<boolean> {
        return await postsRepository.deletePost(id)
    }
}