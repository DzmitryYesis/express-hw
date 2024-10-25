import {Response} from 'express';
import {RequestWithParam} from '../../../types';
import {blogsRepository} from '../blogs-repository';
import {StatusCodeEnum} from '../../../constants';

export const DeleteBlogController = async (req: RequestWithParam<{
    id: string
}>, res: Response) => {
    const isDeleteBlog = await blogsRepository.deleteBlog(req.params.id);

    if (isDeleteBlog) {
        res.status(StatusCodeEnum.NO_CONTENT_204).end()
    } else {
        res.status(StatusCodeEnum.NOT_FOUND_404).end()
    }
}