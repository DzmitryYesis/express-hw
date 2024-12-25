import {BlogsService} from "./BlogsService";
import {Response} from "express";
import {QueryBlogsRepository} from "./QueryBlogsRepository";
import {
    RequestWithBody,
    RequestWithParam,
    RequestWithParamAndBody,
    RequestWithParamAndQuery,
    RequestWithQuery,
    TInputBlog,
    TInputPost,
    TBlog,
    TPost,
    TOutPutErrorsType,
    TBlogsQuery,
    TPostsQuery,
    TResponseWithPagination
} from "../../types";
import {HttpStatusCodeEnum} from "../../constants";
import {QueryPostsRepository} from "../posts";
import {formatQueryBlogsData, formatQueryPostsData} from "../../utils";
import {inject, injectable} from "inversify";

@injectable()
export class BlogsController {
    constructor(
        @inject(BlogsService) protected blogsService: BlogsService,
        @inject(QueryBlogsRepository) protected queryBlogsRepository: QueryBlogsRepository,
        @inject(QueryPostsRepository) protected queryPostsRepository: QueryPostsRepository,
    ) {
    }

    async getBlogs(req: RequestWithQuery<TBlogsQuery>, res: Response<TResponseWithPagination<TBlog[]>>) {
        const blogs = await this.queryBlogsRepository.getBlogs(formatQueryBlogsData(req.query) as TBlogsQuery) as TResponseWithPagination<TBlog[]>

        res.status(HttpStatusCodeEnum.OK_200).json(blogs)
    }

    async getBlogById(req: RequestWithParam<{ id: string }>, res: Response<TBlog>) {
        const blog = await this.queryBlogsRepository.getBlogById(req.params.id)
        if (blog) {
            res.status(HttpStatusCodeEnum.OK_200).json(blog)
        } else {
            res.status(HttpStatusCodeEnum.NOT_FOUND_404).end()
        }
    }

    async getPostForBlog(req: RequestWithParamAndQuery<{
        id: string
    }, TPostsQuery>, res: Response<TResponseWithPagination<TPost[]>>) {
        const {result} = await this.blogsService.findBlogById(req.params.id);

        if (result === "SUCCESS") {
            const posts = await this.queryBlogsRepository.getPostForBlogById(req.params.id, formatQueryPostsData(req.query) as TPostsQuery, req.userId);

            res.status(HttpStatusCodeEnum.OK_200).json(posts);
        } else {
            res.status(HttpStatusCodeEnum.NOT_FOUND_404).end()
        }
    }

    async createBlog(req: RequestWithBody<TInputBlog>, res: Response<TBlog | TOutPutErrorsType>) {
        const {data} = await this.blogsService.createBlog(req.body);
        const newBlog = await this.queryBlogsRepository.getBlogById(data!);

        res
            .status(HttpStatusCodeEnum.CREATED_201)
            .json(newBlog!)
    }

    async createPostForBlog(req: RequestWithParamAndBody<{
        id: string
    }, TInputPost>, res: Response<TPost | TOutPutErrorsType>) {
        const {result, data} = await this.blogsService.createPostForBlog(req.params.id, req.body);

        if (result === "SUCCESS") {
            const newPost = await this.queryPostsRepository.getPostById(data!, req.userId);

            res.status(HttpStatusCodeEnum.CREATED_201).json(newPost!)
        } else {
            res.status(HttpStatusCodeEnum.NOT_FOUND_404).end()
        }
    }

    async updateBlog(req: RequestWithParamAndBody<{
        id: string
    }, TInputBlog>, res: Response) {
        const {result} = await this.blogsService.updateBlogById(req.params.id, req.body);

        if (result === "SUCCESS") {
            res.status(HttpStatusCodeEnum.NO_CONTENT_204).end()
        } else {
            res.status(HttpStatusCodeEnum.NOT_FOUND_404).end()
        }
    }

    async deleteBlog(req: RequestWithParam<{
        id: string
    }>, res: Response) {
        const {result} = await this.blogsService.deleteBlog(req.params.id);

        if (result === "SUCCESS") {
            res.status(HttpStatusCodeEnum.NO_CONTENT_204).end()
        } else {
            res.status(HttpStatusCodeEnum.NOT_FOUND_404).end()
        }
    }
}