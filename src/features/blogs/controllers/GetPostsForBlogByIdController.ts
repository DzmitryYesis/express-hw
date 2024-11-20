import {TPostsQuery, RequestWithParamAndQuery, TResponseWithPagination, TPost} from "../../../types";
import {queryBlogsRepository} from "../query-blogs-repository";
import {formatQueryPostsData} from "../../../utils";
import {Response} from 'express';
import {blogsService} from "../blog-service";
import {HttpStatusCodeEnum} from "../../../constants";

export const GetPostsForBlogByIdController = async (req: RequestWithParamAndQuery<{
    id: string
}, TPostsQuery>, res: Response<TResponseWithPagination<TPost[]>>) => {
    const {result} = await blogsService.findBlogById(req.params.id);

    if (result === "SUCCESS") {
        const posts = await queryBlogsRepository.getPostForBlogById(req.params.id, formatQueryPostsData(req.query) as TPostsQuery);

        res.status(HttpStatusCodeEnum.OK_200).json(posts);
    } else {
        res.status(HttpStatusCodeEnum.NOT_FOUND_404).end()
    }
}