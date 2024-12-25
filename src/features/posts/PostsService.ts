import {TInputComment, TInputPost, TResultServiceObj} from "../../types";
import {TCommentDB, TPostDB} from "../../db";
import {PostsRepository} from "./PostsRepository";
import {UsersRepository} from "../users";
import {CommentsRepository} from "../comments";
import {BlogsRepository} from "../blogs";
import {createServiceResultObj} from "../../utils";
import {inject, injectable} from "inversify";

@injectable()
export class PostsService {
    constructor(
        @inject(BlogsRepository) protected blogsRepository: BlogsRepository,
        @inject(PostsRepository) protected postsRepository: PostsRepository,
        @inject(UsersRepository) protected usersRepository: UsersRepository,
        @inject(CommentsRepository) protected commentsRepository: CommentsRepository
    ) {
    }

    async findPostById(id: string): Promise<TResultServiceObj<TPostDB>> {
        const post = await this.postsRepository.findPostById(id);

        if (post) {
            return createServiceResultObj<TPostDB>("SUCCESS", "OK", post);
        } else {
            return createServiceResultObj("REJECT", "NOT_FOUND");
        }
    }

    async createPost(data: TInputPost): Promise<TResultServiceObj<string>> {
        const blog = await this.blogsRepository.findBlogById(data.blogId);

        if (blog) {
            const newPost: Omit<TPostDB, '_id'> = {
                blogName: blog.name,
                createdAt: new Date().toISOString(),
                ...data,
                extendedLikesInfo: {
                    likes: [],
                    dislikes: []
                }
            }

            const insertedId = await this.postsRepository.createPost(newPost);

            return createServiceResultObj<string>("SUCCESS", "CREATED", insertedId);
        }

        return createServiceResultObj("REJECT", "NOT_FOUND");
    }

    async createCommentForPost(id: string, data: TInputComment, userId: string): Promise<TResultServiceObj<string>> {
        const {result, status} = await this.findPostById(id);

        if (result === "SUCCESS") {
            const personalData = await this.usersRepository.findUserById(userId);
            const newComment: Omit<TCommentDB, '_id'> = {
                commentatorInfo: {
                    userId: personalData!._id.toString(),
                    userLogin: personalData!.accountData.login,
                },
                createdAt: new Date().toISOString(),
                postId: id,
                ...data,
                likesInfo: {
                    likes: [],
                    dislikes: [],
                }
            }

            const insertedId = await this.commentsRepository.createComment(newComment);

            return createServiceResultObj<string>("SUCCESS", "CREATED", insertedId);
        }
        return createServiceResultObj(result, status);
    }

    async updatePostById(id: string, data: TInputPost): Promise<TResultServiceObj> {
        const isUpdate = await this.postsRepository.updatePostById(id, data)

        if (isUpdate) {
            return createServiceResultObj("SUCCESS", "NO_CONTENT")
        } else {
            return createServiceResultObj("REJECT", "NOT_FOUND");
        }
    }

    async deletePost(id: string): Promise<TResultServiceObj> {
        const isDelete = await this.postsRepository.deletePost(id)

        if (isDelete) {
            return createServiceResultObj("SUCCESS", "NO_CONTENT")
        } else {
            return createServiceResultObj("REJECT", "NOT_FOUND");
        }
    }
}
