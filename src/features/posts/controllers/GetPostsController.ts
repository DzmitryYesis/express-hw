import {Response} from 'express';
import {StatusCodeEnum} from '../../../constants';
import {RequestWithQuery, TPost, TPostsQuery, TResponseWithPagination} from "../../../types";
import {formatQueryPostsData} from "../../../utils";
import {queryPostsRepository} from "../query-posts-repository";

export const GetPostsController = async (req: RequestWithQuery<TPostsQuery>, res: Response<TResponseWithPagination<TPost[]>>) => {
    const posts = await queryPostsRepository.getPosts(formatQueryPostsData(req.query) as TPostsQuery) as TResponseWithPagination<TPost[]>;

    res
        .status(StatusCodeEnum.OK_200)
        .json(posts)
};