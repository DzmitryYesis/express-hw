import {
    RequestWithBody,
    RequestWithParam,
    RequestWithParamAndBody,
    RequestWithParamAndQuery,
    RequestWithQuery,
    TCommentsQuery,
    TPostsQuery,
    TResponseWithPagination,
    TComment,
    TPost,
    TInputComment,
    TInputPost,
    TOutPutErrorsType
} from "../../types";
import {Response} from "express";
import {QueryPostsRepository} from "./QueryPostsRepository";
import {formatQueryCommentsData, formatQueryPostsData} from "../../utils";
import {HttpStatusCodeEnum} from "../../constants";
import {PostsService} from "./PostsService";
import {QueryCommentsRepository} from "../comments";

export class PostsController {
    constructor(
        protected queryPostsRepository: QueryPostsRepository,
        protected postsService: PostsService,
        protected queryCommentsRepository: QueryCommentsRepository
    ) {
    }

    async getPosts(req: RequestWithQuery<TPostsQuery>, res: Response<TResponseWithPagination<TPost[]>>) {
        const posts = await this.queryPostsRepository.getPosts(formatQueryPostsData(req.query) as TPostsQuery) as TResponseWithPagination<TPost[]>;

        res
            .status(HttpStatusCodeEnum.OK_200)
            .json(posts)
    }

    async getPostById(
        req: RequestWithParam<{ id: string }>,
        res: Response<TPost>) {
        const post = await this.queryPostsRepository.getPostById(req.params.id)
        if (post) {
            res
                .status(HttpStatusCodeEnum.OK_200)
                .json(post)
        } else {
            res.status(HttpStatusCodeEnum.NOT_FOUND_404).end()
        }
    }

    async getCommentForPost(req: RequestWithParamAndQuery<{
        id: string
    }, TCommentsQuery>, res: Response<TResponseWithPagination<TComment[]>>) {
        const {result} = await this.postsService.findPostById(req.params.id);

        if (result === "SUCCESS") {
            const comments = await this.queryPostsRepository.getCommentsForPostById(req.params.id, formatQueryCommentsData(req.query) as TCommentsQuery, req.userId);

            res.status(HttpStatusCodeEnum.OK_200).json(comments)
        } else {
            res.status(HttpStatusCodeEnum.NOT_FOUND_404).end()
        }
    }

    async createPost(req: RequestWithBody<TInputPost>, res: Response<TPost | TOutPutErrorsType>) {
        const {result, data} = await this.postsService.createPost(req.body);

        if (result === "SUCCESS" && data) {
            const newPost = await this.queryPostsRepository.getPostById(data);

            res.status(HttpStatusCodeEnum.CREATED_201).json(newPost!)
        } else {
            //optional
            res.status(HttpStatusCodeEnum.NOT_FOUND_404).end()
        }
    }

    async createCommentForPost(req: RequestWithParamAndBody<{
        id: string
    }, TInputComment>, res: Response<TComment | TOutPutErrorsType>) {
        const {result, data} = await this.postsService.createCommentForPost(req.params.id, req.body, req.userId!)

        if (result === "SUCCESS" && data) {
            const newComment = await this.queryCommentsRepository.getCommentById(data, req.userId);

            res.status(HttpStatusCodeEnum.CREATED_201).json(newComment!);
        } else {
            res.status(HttpStatusCodeEnum.NOT_FOUND_404).end()
        }
    }

    async updatePost(req: RequestWithParamAndBody<{
        id: string
    }, TInputPost>, res: Response) {
        const {result} = await this.postsService.updatePostById(req.params.id, req.body);

        if (result === "SUCCESS") {
            res.status(HttpStatusCodeEnum.NO_CONTENT_204).end()
        } else {
            res.status(HttpStatusCodeEnum.NOT_FOUND_404).end()
        }
    }

    async deletePost(req: RequestWithParam<{
        id: string
    }>, res: Response) {
        const {result} = await this.postsService.deletePost(req.params.id);

        if (result === "SUCCESS") {
            res.status(HttpStatusCodeEnum.NO_CONTENT_204).end()
        } else {
            res.status(HttpStatusCodeEnum.NOT_FOUND_404).end()
        }
    }
}