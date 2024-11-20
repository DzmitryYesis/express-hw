import {Response} from 'express';
import {RequestWithParamAndBody, TInputBlog} from '../../../types';
import {blogsService} from "../blog-service";
import {HttpStatusCodeEnum} from "../../../constants";

export const UpdateBlogByIdController = async (req: RequestWithParamAndBody<{
    id: string
}, TInputBlog>, res: Response) => {
    const {result} = await blogsService.updateBlogById(req.params.id, req.body);

    if (result === "SUCCESS") {
        res.status(HttpStatusCodeEnum.NO_CONTENT_204).end()
    } else {
        res.status(HttpStatusCodeEnum.NOT_FOUND_404).end()
    }
}