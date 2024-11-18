import {TInputComment, TOutPutErrorsType, RequestWithParamAndBody, TComment} from "../../../types";
import {Response} from "express";
import {StatusCodeEnum} from "../../../constants";
import {queryPostsRepository} from "../query-posts-repository";
import {postsService} from "../posts-service";
import {queryCommentsRepository} from "../../comments";

export const CreateNewCommentForPostByIdController = async (req: RequestWithParamAndBody<{
    id: string
}, TInputComment>, res: Response<TComment | TOutPutErrorsType>) => {
    const post = await queryPostsRepository.getPostById(req.params.id);

    if (post) {
        const newCommentId = await postsService.createCommentForPost(req.params.id, req.body, req.userId!)
        const newComment = await queryCommentsRepository.getCommentById(newCommentId);

        res
            .status(StatusCodeEnum.CREATED_201)
            .json(newComment!);
    } else {
        res.status(StatusCodeEnum.NOT_FOUND_404).end()
    }
}