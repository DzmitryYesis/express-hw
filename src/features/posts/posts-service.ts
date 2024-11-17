import {TComment, TCommentDB, TPost} from "../../db";
import {TCommentsQuery, TInputComment, TInputPost, TPostsQuery, TResponseWithPagination} from "../types";
import {postsRepository} from "./posts-repository";
import {blogsRepository} from "../blogs";
import {usersRepository} from "../users";
import {commentsRepository} from "../comments";

export const postsService = {
    async getPosts(queryData: TPostsQuery): Promise<TResponseWithPagination<TPost[]>> {
        return await postsRepository.getPosts(queryData);
    },
    async getPostById(id: string): Promise<TPost | null> {
        return await postsRepository.getPostById(id);
    },
    async getCommentsForPostById(id: string, queryData: TCommentsQuery): Promise<TResponseWithPagination<TComment[]> | null> {
        const post = await postsRepository.getPostById(id);
        if (post) {
            return await postsRepository.getCommentsForPostById(post.id, queryData);
        }
        return post;
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
    async createCommentForPost(id: string, data: TInputComment, userId: string): Promise<TComment | null> {
        const post = await postsRepository.getPostById(id);

        if (post) {
            const personalData = await usersRepository.getUserById(userId);
            const newComment: Omit<TCommentDB, '_id'> = {
                commentatorInfo: {
                    userId: personalData!.userId,
                    userLogin: personalData!.login,
                },
                createdAt: new Date().toISOString(),
                postId: post.id,
                ...data
            }

            return await commentsRepository.createComment(newComment);
        }

        return post
    },
    async updatePostById(id: string, data: TInputPost): Promise<boolean> {
        return await postsRepository.updatePostById(id, data)
    },
    async deletePost(id: string): Promise<boolean> {
        return await postsRepository.deletePost(id)
    }
}