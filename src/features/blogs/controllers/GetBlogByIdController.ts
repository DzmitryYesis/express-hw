import {RequestWithParam} from '../../../types';
import {Response} from 'express';
import {TBlog} from '../../../db';
import {blogsRepository} from '../blogs-repository';
import {StatusCodeEnum} from '../../../constants/';

export const GetBlogByIdController = async (req: RequestWithParam<{ id: string }>, res: Response<TBlog>) => {
    const blog = await blogsRepository.getBlogById(req.params.id)
    if (blog) {
        res
            .status(StatusCodeEnum.OK_200)
            .json(blog)
    } else {
        res.status(StatusCodeEnum.NOT_FOUND_404).end()
    }
}