import {Response} from 'express';
import {RequestWithBody, TInputBlog, TOutPutErrorsType, TBlog} from '../../../types';
import {HttpStatusCodeEnum} from '../../../constants';
import {blogsService} from "../blog-service";
import {queryBlogsRepository} from "../query-blogs-repository";

export const CreateBlogController = async (req: RequestWithBody<TInputBlog>, res: Response<TBlog | TOutPutErrorsType>) => {
    const {data} = await blogsService.createBlog(req.body);
    const newBlog = await queryBlogsRepository.getBlogById(data!);

    res
        .status(HttpStatusCodeEnum.CREATED_201)
        .json(newBlog!)
}