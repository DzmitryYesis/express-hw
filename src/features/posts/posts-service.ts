import {TInputComment, TInputPost, TResultServiceObj} from "../../types";
import {TCommentDB, TPostDB} from "../../db";
import {postsRepository} from "./posts-repository";
import {usersRepository} from "../users";
import {commentsRepository} from "../comments";
import {blogsRepository} from "../blogs";
import {createServiceResultObj} from "../../utils";

export const postsService = {
    async findPostById(id: string): Promise<TResultServiceObj<TPostDB>> {
        const post = await postsRepository.findPostById(id);

        if (post) {
            return createServiceResultObj<TPostDB>("SUCCESS", "OK", post);
        } else {
            return createServiceResultObj("REJECT", "NOT_FOUND");
        }
    },
    async createPost(data: TInputPost): Promise<TResultServiceObj<string>> {
        const blog = await blogsRepository.findBlogById(data.blogId);

        if (blog) {
            const newPost: Omit<TPostDB, '_id'> = {
                blogName: blog.name,
                createdAt: new Date().toISOString(),
                ...data
            }

            const insertedId = await postsRepository.createPost(newPost);

            return createServiceResultObj<string>("SUCCESS", "CREATED", insertedId);
        }

        return createServiceResultObj("REJECT", "NOT_FOUND");
    },
    async createCommentForPost(id: string, data: TInputComment, userId: string): Promise<TResultServiceObj<string>> {
        const {result, status} = await this.findPostById(id);

        if (result === "SUCCESS") {
            const personalData = await usersRepository.findUserById(userId);
            const newComment: Omit<TCommentDB, '_id'> = {
                commentatorInfo: {
                    userId: personalData!._id.toString(),
                    userLogin: personalData!.accountData.login,
                },
                createdAt: new Date().toISOString(),
                postId: id,
                ...data
            }

            const insertedId = await commentsRepository.createComment(newComment);

            return createServiceResultObj<string>("SUCCESS", "CREATED", insertedId);
        }
        return createServiceResultObj(result, status);
    },
    async updatePostById(id: string, data: TInputPost): Promise<TResultServiceObj> {
        const isUpdate = await postsRepository.updatePostById(id, data)

        if (isUpdate) {
            return createServiceResultObj("SUCCESS", "NO_CONTENT")
        } else {
            return createServiceResultObj("REJECT", "NOT_FOUND");
        }
    },
    async deletePost(id: string): Promise<TResultServiceObj> {
        const isDelete = await postsRepository.deletePost(id)

        if (isDelete) {
            return createServiceResultObj("SUCCESS", "NO_CONTENT")
        } else {
            return createServiceResultObj("REJECT", "NOT_FOUND");
        }
    }
}