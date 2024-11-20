import {TInputComment, TOutPutErrorsType, RequestWithParamAndBody, TComment} from "../../../types";
import {Response} from "express";
import {postsService} from "../posts-service";
import {queryCommentsRepository} from "../../comments";
import {HttpStatusCodeEnum} from "../../../constants";

export const CreateNewCommentForPostByIdController = async (req: RequestWithParamAndBody<{
    id: string
}, TInputComment>, res: Response<TComment | TOutPutErrorsType>) => {
    const {result, data} = await postsService.createCommentForPost(req.params.id, req.body, req.userId!)

    if (result === "SUCCESS" && data) {
        const newComment = await queryCommentsRepository.getCommentById(data);

        res.status(HttpStatusCodeEnum.CREATED_201).json(newComment!);
    } else {
        res.status(HttpStatusCodeEnum.NOT_FOUND_404).end()
    }
}