import {RequestWithParam, TPost} from '../../../types';
import {Response} from 'express';
import {StatusCodeEnum} from '../../../constants';
import {queryPostsRepository} from "../query-posts-repository";

export const GetPostByIdController = async (
    req: RequestWithParam<{ id: string }>,
    res: Response<TPost>) => {
    const post = await queryPostsRepository.getPostById(req.params.id)
    if (post) {
        res
            .status(StatusCodeEnum.OK_200)
            .json(post)
    } else {
        res.status(StatusCodeEnum.NOT_FOUND_404).end()
    }
}