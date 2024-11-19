import {RequestWithParam} from "../../../types";
import {Response} from "express";
import {StatusCodeEnum} from "../../../constants";
import {commentsService} from "../comments-service";

export const DeleteCommentByIdController = async (req: RequestWithParam<{
    id: string
}>, res: Response) => {
    const comment = await commentsService.findCommentById(req.params.id);

    if (!comment) {
        res.status(StatusCodeEnum.NOT_FOUND_404).end();
    } else if (comment.commentatorInfo.userId !== req.userId!) {
        res.status(StatusCodeEnum.FORBIDDEN_403).end();
    } else {
        const isDeleteComment = await commentsService.deleteCommentById(req.params.id);

        if (isDeleteComment) {
            res.status(StatusCodeEnum.NO_CONTENT_204).end()
        }
    }
}