import {TCommentsQuery, RequestWithParamAndQuery, TResponseWithPagination, TComment} from "../../../types";
import {Response} from "express";
import {formatQueryCommentsData} from "../../../utils";
import {queryPostsRepository} from "../query-posts-repository";
import {postsService} from "../posts-service";
import {HttpStatusCodeEnum} from "../../../constants";

export const GetCommentsForPostByIdController = async (req: RequestWithParamAndQuery<{
    id: string
}, TCommentsQuery>, res: Response<TResponseWithPagination<TComment[]>>) => {
    const {result} = await postsService.findPostById(req.params.id);

    if (result === "SUCCESS") {
        const comments = await queryPostsRepository.getCommentsForPostById(req.params.id, formatQueryCommentsData(req.query) as TCommentsQuery);

        res.status(HttpStatusCodeEnum.OK_200).json(comments)
    } else {
        res.status(HttpStatusCodeEnum.NOT_FOUND_404).end()
    }
}