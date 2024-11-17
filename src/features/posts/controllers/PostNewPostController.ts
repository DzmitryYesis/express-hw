import {RequestWithBody} from '../../../types/requestTypes';
import {TInputPost, TOutPutErrorsType} from '../../types';
import {Response} from 'express';
import {TPost} from '../../../db';
import {StatusCodeEnum} from '../../../constants';
import {postsService} from "../posts-service";

export const PostNewPostController = async (req: RequestWithBody<TInputPost>, res: Response<TPost | TOutPutErrorsType>) => {
    const newPost = await postsService.createPost(req.body);
    res
        .status(StatusCodeEnum.CREATED_201)
        .json(newPost)
}