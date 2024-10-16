import {Request, Response} from 'express';
import {TPost} from '../../../db';
import {StatusCodeEnum} from '../../../constants';
import {postsRepository} from '../posts-repository';

export const GetPostsController = (req: Request, res: Response<TPost[]>) => {
    res
        .status(StatusCodeEnum.OK_200)
        .json(postsRepository.getPosts())
};