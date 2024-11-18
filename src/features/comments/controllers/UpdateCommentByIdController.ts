import {TInputComment, RequestWithParamAndBody} from "../../../types";
import {Response} from "express";
import {StatusCodeEnum} from "../../../constants";
import {queryCommentsRepository} from "../query-comments-repository";
import {commentsService} from "../comments-service";

export const UpdateCommentByIdController = async (req: RequestWithParamAndBody<{
    id: string
}, TInputComment>, res: Response) => {
    const comment = await queryCommentsRepository.getCommentById(req.params.id);

    if (!comment) {
        res.status(StatusCodeEnum.NOT_FOUND_404).end();
    } else if (comment.commentatorInfo.userId !== req.userId!) {
        res.status(StatusCodeEnum.FORBIDDEN_403).end();
    } else {
        const isUpdateComment = await commentsService.updateCommentById(req.params.id, req.body);

        if (isUpdateComment) {
            res.status(StatusCodeEnum.NO_CONTENT_204).end()
        }
    }
}