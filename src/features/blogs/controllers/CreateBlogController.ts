import {Response} from 'express';
import {RequestWithBody, TInputBlog, TOutPutErrorsType, TBlog} from '../../../types';
import {StatusCodeEnum} from '../../../constants';
import {blogsService} from "../blog-service";
import {queryBlogsRepository} from "../query-blogs-repository";

export const CreateBlogController = async (req: RequestWithBody<TInputBlog>, res: Response<TBlog | TOutPutErrorsType>) => {
    const newBlogId = await blogsService.createBlog(req.body);
    const newBlog = await queryBlogsRepository.getBlogById(newBlogId);

    res
        .status(StatusCodeEnum.CREATED_201)
        .json(newBlog!)
}