import {Request, Response} from 'express';
import {TBlog} from '../../../db';
import {StatusCodeEnum} from '../../../constants';
import {blogsRepository} from '../blogs-repository';

export const GetBlogsController = (req: Request, res: Response<TBlog[]>) => {
    res
        .status(StatusCodeEnum.OK_200)
        .json(blogsRepository.getBlogs())
}