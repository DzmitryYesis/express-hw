import {Response} from 'express';
import {RequestWithParamAndBody} from '../../../types';
import {TInputBlog} from '../types';
import {blogsRepository} from '../blogs-repository';
import {StatusCodeEnum} from '../../../constants';

export const PutBlogByIdController = async (req: RequestWithParamAndBody<{
    id: string
}, TInputBlog>, res: Response) => {
    const isUpdateBlog = await blogsRepository.updateBlogById(req.params.id, req.body);

    if (isUpdateBlog) {
        res.status(StatusCodeEnum.NO_CONTENT_204).end()
    } else {
        res.status(StatusCodeEnum.NOT_FOUND_404).end()
    }
}