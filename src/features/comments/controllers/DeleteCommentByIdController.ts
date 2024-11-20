import {RequestWithParam} from "../../../types";
import {Response} from "express";
import {commentsService} from "../comments-service";
import {HttpStatusCodeEnum} from "../../../constants";

export const DeleteCommentByIdController = async (req: RequestWithParam<{
    id: string
}>, res: Response) => {
    const {result, status} = await commentsService.deleteCommentById(req.userId!, req.params.id);

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