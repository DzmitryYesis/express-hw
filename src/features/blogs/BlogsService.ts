import {BlogsRepository} from "../blogs";
import {PostsRepository} from '../posts';
import {TInputBlog, TInputPost, TResultServiceObj} from "../../types";
import {TBlogDB, TPostDB} from "../../db";
import {createServiceResultObj} from "../../utils";
import {inject, injectable} from "inversify";

@injectable()
export class BlogsService {
    constructor(
        @inject(BlogsRepository) protected blogsRepository: BlogsRepository,
        @inject(PostsRepository) protected postsRepository: PostsRepository
    ) {
    }

    async findBlogById(blogId: string): Promise<TResultServiceObj<TBlogDB>> {
        const blog = await this.blogsRepository.findBlogById(blogId);
        if (blog) {
            return createServiceResultObj<TBlogDB>("SUCCESS", "OK", blog);
        }
        return createServiceResultObj("REJECT", "NOT_FOUND");
    }

    async createBlog(data: TInputBlog): Promise<TResultServiceObj<string>> {
        const newBlog: Omit<TBlogDB, '_id'> = {
            createdAt: new Date().toISOString(),
            isMembership: false,
            ...data
        }

        const insertedId = await this.blogsRepository.createBlog(newBlog);

        return createServiceResultObj<string>("SUCCESS", "CREATED", insertedId);
    }

    async createPostForBlog(blogId: string, data: Omit<TInputPost, 'blogId'>): Promise<TResultServiceObj<string>> {
        const {result, status, data: findBlogByIdData} = await this.findBlogById(blogId);

        if (result === "SUCCESS") {
            const newPost: Omit<TPostDB, '_id'> = {
                blogName: findBlogByIdData!.name,
                blogId: blogId,
                createdAt: new Date().toISOString(),
                ...data,
                extendedLikesInfo: {
                    likes: [],
                    dislikes: [],
                }
            }
            const insertedId = await this.postsRepository.createPost(newPost);

            return createServiceResultObj<string>("SUCCESS", "CREATED", insertedId);
        }

        return createServiceResultObj(result, status);
    }

    async updateBlogById(id: string, data: TInputBlog): Promise<TResultServiceObj> {
        const isUpdate = await this.blogsRepository.updateBlogById(id, data);
        if (isUpdate) {
            return createServiceResultObj("SUCCESS", "NO_CONTENT")
        } else {
            return createServiceResultObj("REJECT", "NOT_FOUND");
        }
    }

    async deleteBlog(id: string): Promise<TResultServiceObj> {
        const isDelete = await this.blogsRepository.deleteBlog(id);
        if (isDelete) {
            return createServiceResultObj("SUCCESS", "NO_CONTENT")
        } else {
            return createServiceResultObj("REJECT", "NOT_FOUND");
        }
    }
}