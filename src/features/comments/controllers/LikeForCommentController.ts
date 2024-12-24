import {Response} from 'express'
import {RequestWithParamAndBody, TInputLikeComment, TOutPutErrorsType} from "../../../types";
import {commentsService} from "../comments-service";
import {HttpStatusCodeEnum} from "../../../constants";

export const LikeForCommentController = async (req: RequestWithParamAndBody<{
    id: string
}, TInputLikeComment>, res: Response<TOutPutErrorsType>) => {
    const {result} = await commentsService.likeComment(req.params.id, req.body.likeStatus, req.userId!)

    if (result === "SUCCESS") {
        res.status(HttpStatusCodeEnum.NO_CONTENT_204).end();
    } else {
        res.status(HttpStatusCodeEnum.NOT_FOUND_404).end();
    }
}