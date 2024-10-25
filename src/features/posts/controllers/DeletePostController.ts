import {RequestWithParam} from '../../../types';
import {Response} from 'express';
import {postsRepository} from '../posts-repository';
import {StatusCodeEnum} from '../../../constants';

export const DeletePostController = async (req: RequestWithParam<{
    id: string
}>, res: Response) => {
    const isDeletePost = await postsRepository.deletePost(req.params.id);

    if (isDeletePost) {
        res.status(StatusCodeEnum.NO_CONTENT_204).end()
    } else {
        res.status(StatusCodeEnum.NOT_FOUND_404).end()
    }
}