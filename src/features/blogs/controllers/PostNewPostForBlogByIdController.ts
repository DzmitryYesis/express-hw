import {RequestWithParamAndBody} from "../../../types/requestTypes";
import {TInputPost, TOutPutErrorsType} from "../../types";
import {Response} from "express";
import {TPost} from "../../../db";
import {blogsService} from "../blog-service";
import {StatusCodeEnum} from "../../../constants";

export const PostNewPostForBlogByIdController = async (req: RequestWithParamAndBody<{
    id: string
}, Omit<TInputPost, 'blogId'>>, res: Response<TPost | TOutPutErrorsType>) => {
    const newPost = await blogsService.createPostForBlog(req.params.id, req.body);

    if (newPost) {
        res
            .status(StatusCodeEnum.CREATED_201)
            .json(newPost)
    } else {
        res.status(StatusCodeEnum.NOT_FOUND_404).end()
    }
}