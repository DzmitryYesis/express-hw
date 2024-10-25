import {Request, Response} from 'express';
import {TPost} from '../../../db';
import {StatusCodeEnum} from '../../../constants';
import {postsRepository} from '../posts-repository';

export const GetPostsController = async (req: Request, res: Response<TPost[]>) => {
    const posts = await postsRepository.getPosts();

    res
        .status(StatusCodeEnum.OK_200)
        .json(posts)
};