import {Response} from 'express';
import {RequestWithParam} from '../../../types';
import {blogsService} from "../blog-service";
import {HttpStatusCodeEnum} from "../../../constants";

export const DeleteBlogController = async (req: RequestWithParam<{
    id: string
}>, res: Response) => {
    const {result} = await blogsService.deleteBlog(req.params.id);

    if (result === "SUCCESS") {
        res.status(HttpStatusCodeEnum.NO_CONTENT_204).end()
    } else {
        res.status(HttpStatusCodeEnum.NOT_FOUND_404).end()
    }
}