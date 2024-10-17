import {Response} from 'express';
import {RequestWithParamAndBody} from '../../../types';
import {TInputPost} from '../../blogs/types';
import {postsRepository} from '../posts-repository';
import {StatusCodeEnum} from '../../../constants';

export const PutPostByIdController = (req: RequestWithParamAndBody<{
    id: string
}, TInputPost>, res: Response) => {
    const isUpdatePost = postsRepository.updatePostById(req.params.id, req.body);

    if (isUpdatePost) {
        res.status(StatusCodeEnum.NO_CONTENT_204).end()
    } else {
        res.status(StatusCodeEnum.NOT_FOUND_404).end()
    }
}