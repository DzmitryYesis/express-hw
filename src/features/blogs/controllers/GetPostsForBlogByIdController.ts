import {TPostsQuery, RequestWithParamAndQuery, TResponseWithPagination, TPost} from "../../../types";
import {queryBlogsRepository} from "../query-blogs-repository";
import {formatQueryPostsData} from "../../../utils";
import {StatusCodeEnum} from "../../../constants";
import {Response} from 'express';

export const GetPostsForBlogByIdController = async (req: RequestWithParamAndQuery<{
    id: string
}, TPostsQuery>, res: Response<TResponseWithPagination<TPost[]>>) => {
    const blog = await queryBlogsRepository.getBlogById(req.params.id);

    if (blog) {
        const posts = await queryBlogsRepository.getPostForBlogById(req.params.id, formatQueryPostsData(req.query) as TPostsQuery);

        res.status(StatusCodeEnum.OK_200).json(posts);
    } else {
        res.status(StatusCodeEnum.NOT_FOUND_404).end()
    }
}