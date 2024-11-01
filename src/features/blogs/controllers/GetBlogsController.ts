import {Request, Response} from 'express';
import {TBlog} from '../../../db';
import {StatusCodeEnum} from '../../../constants';
import {blogsService} from "../blog-service";

export const GetBlogsController = async (req: Request, res: Response<TBlog[]>) => {
    const blogs = await blogsService.getBlogs()

    res
        .status(StatusCodeEnum.OK_200)
        .json(blogs)
}