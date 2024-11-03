import {Response} from 'express';
import {TPost} from '../../../db';
import {StatusCodeEnum} from '../../../constants';
import {postsService} from "../posts-service";
import {RequestWithQuery} from "../../../types";
import {TPostsQuery, TResponseWithPagination} from "../../types";
import {formatQueryData} from "../../../utils";

export const GetPostsController = async (req: RequestWithQuery<TPostsQuery>, res: Response) => {
    const posts = await postsService.getPosts(formatQueryData(req.query) as TPostsQuery) as TResponseWithPagination<TPost[]>;

    res
        .status(StatusCodeEnum.OK_200)
        .json(posts)
};