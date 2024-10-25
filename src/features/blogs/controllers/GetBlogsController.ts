import {Request, Response} from 'express';
import {TBlog} from '../../../db';
import {StatusCodeEnum} from '../../../constants';
import {blogsRepository} from '../blogs-repository';

export const GetBlogsController = async (req: Request, res: Response<TBlog[]>) => {
    const blogs = await blogsRepository.getBlogs()

    res
        .status(StatusCodeEnum.OK_200)
        .json(blogs)
}