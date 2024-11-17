import {RequestWithParam} from "../../../types/requestTypes";
import {Response} from "express";
import {TComment} from "../../../db";
import {StatusCodeEnum} from "../../../constants";
import {commentsService} from "../comments-service";

export const GetCommentsByIdController = async (req: RequestWithParam<{ id: string }>, res: Response<TComment>) => {
    const comment = await commentsService.getCommentById(req.params.id)
    if (comment) {
        res
            .status(StatusCodeEnum.OK_200)
            .json(comment)
    } else {
        res.status(StatusCodeEnum.NOT_FOUND_404).end()
    }
}