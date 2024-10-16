import {Response} from 'express';
import {RequestWithBody} from '../../../types';
import {TInputBlog, TOutPutErrorsType} from '../types';
import {TBlog} from '../../../db';
import {blogsRepository} from '../blogs-repository';
import {StatusCodeEnum} from '../../../constants';

export const PostBlogController = (req: RequestWithBody<TInputBlog>, res: Response<TBlog | TOutPutErrorsType>) => {
    const newBlog = blogsRepository.createBlog(req.body);
    res
        .status(StatusCodeEnum.CREATED_201)
        .json(newBlog)
}