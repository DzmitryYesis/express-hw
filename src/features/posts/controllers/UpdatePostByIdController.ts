import {Response} from 'express';
import {TInputPost, RequestWithParamAndBody} from '../../../types';
import {postsService} from "../posts-service";
import {HttpStatusCodeEnum} from "../../../constants";

export const UpdatePostByIdController = async (req: RequestWithParamAndBody<{
    id: string
}, TInputPost>, res: Response) => {
    const {result} = await postsService.updatePostById(req.params.id, req.body);

    if (result === "SUCCESS") {
        res.status(HttpStatusCodeEnum.NO_CONTENT_204).end()
    } else {
        res.status(HttpStatusCodeEnum.NOT_FOUND_404).end()
    }
}