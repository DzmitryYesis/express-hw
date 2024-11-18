import {Response} from 'express';
import {TInputPost, RequestWithParamAndBody} from '../../../types';
import {StatusCodeEnum} from '../../../constants';
import {postsService} from "../posts-service";

export const UpdatePostByIdController = async (req: RequestWithParamAndBody<{
    id: string
}, TInputPost>, res: Response) => {
    const isUpdatePost = await postsService.updatePostById(req.params.id, req.body);

    if (isUpdatePost) {
        res.status(StatusCodeEnum.NO_CONTENT_204).end()
    } else {
        res.status(StatusCodeEnum.NOT_FOUND_404).end()
    }
}