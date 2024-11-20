import {RequestWithParam, TPost} from '../../../types';
import {Response} from 'express';
import {HttpStatusCodeEnum} from '../../../constants';
import {queryPostsRepository} from "../query-posts-repository";

export const GetPostByIdController = async (
    req: RequestWithParam<{ id: string }>,
    res: Response<TPost>) => {
    const post = await queryPostsRepository.getPostById(req.params.id)
    if (post) {
        res
            .status(HttpStatusCodeEnum.OK_200)
            .json(post)
    } else {
        res.status(HttpStatusCodeEnum.NOT_FOUND_404).end()
    }
}