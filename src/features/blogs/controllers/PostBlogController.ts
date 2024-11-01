import {Response} from 'express';
import {RequestWithBody} from '../../../types';
import {TInputBlog, TOutPutErrorsType} from '../types';
import {TBlog} from '../../../db';
import {StatusCodeEnum} from '../../../constants';
import {blogsService} from "../blog-service";

export const PostBlogController = async (req: RequestWithBody<TInputBlog>, res: Response<TBlog | TOutPutErrorsType>) => {
    const newBlog = await blogsService.createBlog(req.body);
    res
        .status(StatusCodeEnum.CREATED_201)
        .json(newBlog)
}