import {Response} from 'express';
import {RequestWithBody} from '../../../types';
import {TInputBlog, TOutPutErrorsType} from '../types';
import {TBlog} from '../../../db';
import {blogsRepository} from '../blogs-repository';
import {StatusCodeEnum} from '../../../constants';

export const PostBlogController = async (req: RequestWithBody<TInputBlog>, res: Response<TBlog | TOutPutErrorsType>) => {
    const newBlog = await blogsRepository.createBlog(req.body);
    res
        .status(StatusCodeEnum.CREATED_201)
        .json(newBlog)
}