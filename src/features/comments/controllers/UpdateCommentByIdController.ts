import {TInputComment, RequestWithParamAndBody} from "../../../types";
import {Response} from "express";
import {commentsService} from "../comments-service";
import {HttpStatusCodeEnum} from "../../../constants";

export const UpdateCommentByIdController = async (req: RequestWithParamAndBody<{
    id: string
}, TInputComment>, res: Response) => {
    const {result, status} = await commentsService.updateCommentById(req.userId!, req.params.id, req.body);

    if (result === "SUCCESS") {
        res.status(HttpStatusCodeEnum.NO_CONTENT_204).end();
    } else {
        if (status === "FORBIDDEN") {
            res.status(HttpStatusCodeEnum.FORBIDDEN_403).end();
        } else {
            res.status(HttpStatusCodeEnum.NOT_FOUND_404).end();
        }
    }
}