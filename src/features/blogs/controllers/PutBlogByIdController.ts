import {Response} from 'express';
import {RequestWithParamAndBody} from '../../../types/requestTypes';
import {TInputBlog} from '../../types';
import {StatusCodeEnum} from '../../../constants';
import {blogsService} from "../blog-service";

export const PutBlogByIdController = async (req: RequestWithParamAndBody<{
    id: string
}, TInputBlog>, res: Response) => {
    const isUpdateBlog = await blogsService.updateBlogById(req.params.id, req.body);

    if (isUpdateBlog) {
        res.status(StatusCodeEnum.NO_CONTENT_204).end()
    } else {
        res.status(StatusCodeEnum.NOT_FOUND_404).end()
    }
}