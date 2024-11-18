import {RequestWithParam, TComment} from "../../../types";
import {Response} from "express";
import {StatusCodeEnum} from "../../../constants";
import {queryCommentsRepository} from "../query-comments-repository";

export const GetCommentsByIdController = async (req: RequestWithParam<{ id: string }>, res: Response<TComment>) => {
    const comment = await queryCommentsRepository.getCommentById(req.params.id)
    if (comment) {
        res
            .status(StatusCodeEnum.OK_200)
            .json(comment)
    } else {
        res.status(StatusCodeEnum.NOT_FOUND_404).end()
    }
}