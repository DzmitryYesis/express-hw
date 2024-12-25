import {Response} from "express";
import {
    TComment,
    RequestWithParam,
    RequestWithParamAndBody,
    TInputComment,
    TInputLikeComment,
    TOutPutErrorsType
} from "../../types";
import {QueryCommentsRepository} from "./QueryCommentsRepository";
import {HttpStatusCodeEnum} from "../../constants";
import {CommentsService} from "./CommentsService";
import {inject, injectable} from "inversify";

@injectable()
export class CommentsController {
    constructor(
        @inject(QueryCommentsRepository) protected queryCommentsRepository: QueryCommentsRepository,
        @inject(CommentsService) protected commentsService: CommentsService,
    ) {
    }

    async getCommentById(req: RequestWithParam<{ id: string }>, res: Response<TComment>) {
        const comment = await this.queryCommentsRepository.getCommentById(req.params.id, req.userId)
        if (comment) {
            res
                .status(HttpStatusCodeEnum.OK_200)
                .json(comment)
        } else {
            res.status(HttpStatusCodeEnum.NOT_FOUND_404).end()
        }
    }

    async updateComment(req: RequestWithParamAndBody<{
        id: string
    }, TInputComment>, res: Response) {
        const {result, status} = await this.commentsService.updateCommentById(req.userId!, req.params.id, req.body);

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

    async likeForComment(req: RequestWithParamAndBody<{
        id: string
    }, TInputLikeComment>, res: Response<TOutPutErrorsType>) {
        const {result} = await this.commentsService.likeComment(req.params.id, req.body.likeStatus, req.userId!)

        if (result === "SUCCESS") {
            res.status(HttpStatusCodeEnum.NO_CONTENT_204).end();
        } else {
            res.status(HttpStatusCodeEnum.NOT_FOUND_404).end();
        }
    }

    async deleteComment(req: RequestWithParam<{
        id: string
    }>, res: Response) {
        const {result, status} = await this.commentsService.deleteCommentById(req.userId!, req.params.id);

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
}