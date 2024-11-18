import {TCommentsQuery, RequestWithParamAndQuery, TResponseWithPagination, TComment} from "../../../types";
import {Response} from "express";
import {formatQueryCommentsData} from "../../../utils";
import {StatusCodeEnum} from "../../../constants";
import {queryPostsRepository} from "../query-posts-repository";

export const GetCommentsForPostByIdController = async (req: RequestWithParamAndQuery<{
    id: string
}, TCommentsQuery>, res: Response<TResponseWithPagination<TComment[]>>) => {
    const post = await queryPostsRepository.getPostById(req.params.id);

    if (post) {
        const comments = await queryPostsRepository.getCommentsForPostById(req.params.id, formatQueryCommentsData(req.query) as TCommentsQuery);

        res
            .status(StatusCodeEnum.OK_200)
            .json(comments)
    } else {
        res.status(StatusCodeEnum.NOT_FOUND_404).end()
    }
}