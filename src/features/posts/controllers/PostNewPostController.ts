import {RequestWithBody} from '../../../types';
import {TInputPost, TOutPutErrorsType} from '../../blogs/types';
import {Response} from 'express';
import {TPost} from '../../../db';
import {StatusCodeEnum} from '../../../constants';
import {postsRepository} from '../posts-repository';

export const PostNewPostController = async (req: RequestWithBody<TInputPost>, res: Response<TPost | TOutPutErrorsType>) => {
    const newPost = await postsRepository.createPost(req.body);
    res
        .status(StatusCodeEnum.CREATED_201)
        .json(newPost)
}