import {Response} from 'express';
import {RequestWithParam} from '../../../types';
import {StatusCodeEnum} from '../../../constants';
import {blogsService} from "../blog-service";

export const DeleteBlogController = async (req: RequestWithParam<{
    id: string
}>, res: Response) => {
    const isDeleteBlog = await blogsService.deleteBlog(req.params.id);

    if (isDeleteBlog) {
        res.status(StatusCodeEnum.NO_CONTENT_204).end()
    } else {
        res.status(StatusCodeEnum.NOT_FOUND_404).end()
    }
}