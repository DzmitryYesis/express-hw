import {Request, Response, Router} from 'express';
import {TBlog} from '../db';
import {StatusCodeEnum} from '../constans';
import {blogsRepository} from '../repositories';

export const blogsRouter = Router();

const blogsController = {
    getBlogs: (req: Request, res: Response<TBlog[]>) => {
        res
            .status(StatusCodeEnum.OK_200)
            .json(blogsRepository.getBlogs())
    }
}

blogsRouter.get('/', blogsController.getBlogs)