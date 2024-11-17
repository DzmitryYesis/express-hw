import {RequestWithParam} from '../../../types/requestTypes';
import {Response} from 'express';
import {TBlog} from '../../../db';
import {StatusCodeEnum} from '../../../constants/';
import {blogsService} from "../blog-service";

export const GetBlogByIdController = async (req: RequestWithParam<{ id: string }>, res: Response<TBlog>) => {
    const blog = await blogsService.getBlogById(req.params.id)
    if (blog) {
        res
            .status(StatusCodeEnum.OK_200)
            .json(blog)
    } else {
        res.status(StatusCodeEnum.NOT_FOUND_404).end()
    }
}