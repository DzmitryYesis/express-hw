import {RequestWithParam} from '../../../types/requestTypes';
import {Response} from 'express';
import {StatusCodeEnum} from '../../../constants';
import {postsService} from "../posts-service";

export const DeletePostController = async (req: RequestWithParam<{
    id: string
}>, res: Response) => {
    const isDeletePost = await postsService.deletePost(req.params.id);

    if (isDeletePost) {
        res.status(StatusCodeEnum.NO_CONTENT_204).end()
    } else {
        res.status(StatusCodeEnum.NOT_FOUND_404).end()
    }
}