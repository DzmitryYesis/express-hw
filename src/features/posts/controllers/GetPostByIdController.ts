import {RequestWithParam} from '../../../types';
import {Response} from 'express';
import {TPost} from '../../../db';
import {postsRepository} from '../posts-repository';
import {StatusCodeEnum} from '../../../constants';

export const GetPostByIdController = async (
    req: RequestWithParam<{ id: string }>,
    res: Response<TPost>) => {
    const post = await postsRepository.getPostById(req.params.id)
    if (post) {
        res
            .status(StatusCodeEnum.OK_200)
            .json(post)
    } else {
        res.status(StatusCodeEnum.NOT_FOUND_404).end()
    }
}