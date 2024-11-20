import {RequestWithParam} from '../../../types';
import {Response} from 'express';
import {postsService} from "../posts-service";
import {HttpStatusCodeEnum} from "../../../constants";

export const DeletePostController = async (req: RequestWithParam<{
    id: string
}>, res: Response) => {
    const {result} = await postsService.deletePost(req.params.id);

    if (result === "SUCCESS") {
        res.status(HttpStatusCodeEnum.NO_CONTENT_204).end()
    } else {
        res.status(HttpStatusCodeEnum.NOT_FOUND_404).end()
    }
}