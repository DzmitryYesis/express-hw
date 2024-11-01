import {Request, Response} from 'express';
import {TPost} from '../../../db';
import {StatusCodeEnum} from '../../../constants';
import {postsService} from "../posts-service";

export const GetPostsController = async (req: Request, res: Response<TPost[]>) => {
    const posts = await postsService.getPosts();

    res
        .status(StatusCodeEnum.OK_200)
        .json(posts)
};