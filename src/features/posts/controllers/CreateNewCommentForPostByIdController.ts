import {RequestWithParamAndBody} from "../../../types/requestTypes";
import {TInputComment, TOutPutErrorsType} from "../../types";
import {Response} from "express";
import {TComment} from "../../../db";
import {StatusCodeEnum} from "../../../constants";
import {postsService} from "../posts-service";

export const CreateNewCommentForPostByIdController = async (req: RequestWithParamAndBody<{
    id: string
}, TInputComment>, res: Response<TComment | TOutPutErrorsType>) => {
    const newComment = await postsService.createCommentForPost(req.params.id, req.body, req.userId!);

    if (newComment) {
        res
            .status(StatusCodeEnum.CREATED_201)
            .json(newComment)
    } else {
        res.status(StatusCodeEnum.NOT_FOUND_404).end()
    }
}