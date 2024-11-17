import {RequestWithParam} from '../../../types/requestTypes';
import {Response} from 'express';
import {TPost} from '../../../db';
import {StatusCodeEnum} from '../../../constants';
import {postsService} from "../posts-service";

export const GetPostByIdController = async (
    req: RequestWithParam<{ id: string }>,
    res: Response<TPost>) => {
    const post = await postsService.getPostById(req.params.id)
    if (post) {
        res
            .status(StatusCodeEnum.OK_200)
            .json(post)
    } else {
        res.status(StatusCodeEnum.NOT_FOUND_404).end()
    }
}