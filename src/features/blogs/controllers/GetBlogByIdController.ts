import {RequestWithParam, TBlog} from '../../../types';
import {Response} from 'express';
import {StatusCodeEnum} from '../../../constants/';
import {queryBlogsRepository} from "../query-blogs-repository";

export const GetBlogByIdController = async (req: RequestWithParam<{ id: string }>, res: Response<TBlog>) => {
    const blog = await queryBlogsRepository.getBlogById(req.params.id)
    if (blog) {
        res
            .status(StatusCodeEnum.OK_200)
            .json(blog)
    } else {
        res.status(StatusCodeEnum.NOT_FOUND_404).end()
    }
}