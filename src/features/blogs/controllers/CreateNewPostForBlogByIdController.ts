import {RequestWithParamAndBody, TInputPost, TOutPutErrorsType, TPost} from "../../../types";
import {Response} from "express";
import {blogsService} from "../blog-service";
import {queryPostsRepository} from "../../posts";
import {HttpStatusCodeEnum} from "../../../constants";

export const CreateNewPostForBlogByIdController = async (req: RequestWithParamAndBody<{
    id: string
}, TInputPost>, res: Response<TPost | TOutPutErrorsType>) => {
    const {result, data} = await blogsService.createPostForBlog(req.params.id, req.body);

    if (result === "SUCCESS") {
        const newPost = await queryPostsRepository.getPostById(data!);

        res.status(HttpStatusCodeEnum.CREATED_201).json(newPost!)
    } else {
        res.status(HttpStatusCodeEnum.NOT_FOUND_404).end()
    }
}