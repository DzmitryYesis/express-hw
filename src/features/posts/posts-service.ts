import {TInputComment, TInputPost, TPost} from "../../types";
import {TBlogDB, TCommentDB, TPostDB} from "../../db";
import {postsRepository} from "./posts-repository";
import {usersService} from "../users";
import {commentsRepository} from "../comments";

export const postsService = {
    async findPostById(id: string): Promise<TPostDB | null> {
        return await postsRepository.findPostById(id);
    },
    async createPost(data: TInputPost, blog: TBlogDB): Promise<string> {
        const newPost: Omit<TPost, 'id'> = {
            blogName: blog.name,
            createdAt: new Date().toISOString(),
            ...data
        }

        return await postsRepository.createPost(newPost);
    },
    async createCommentForPost(id: string, data: TInputComment, userId: string): Promise<string> {
        const personalData = await usersService.findUserById(userId);
        const newComment: Omit<TCommentDB, '_id'> = {
            commentatorInfo: {
                userId: personalData!._id.toString(),
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