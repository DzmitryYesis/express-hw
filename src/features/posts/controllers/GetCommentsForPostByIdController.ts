import {RequestWithParamAndQuery} from "../../../types/requestTypes";
import {TCommentsQuery} from "../../types";
import {Response} from "express";
import {formatQueryCommentsData} from "../../../utils";
import {StatusCodeEnum} from "../../../constants";
import {postsService} from "../posts-service";

export const GetCommentsForPostByIdController = async (req: RequestWithParamAndQuery<{
    id: string
}, TCommentsQuery>, res: Response) => {
    const comments = await postsService.getCommentsForPostById(req.params.id, formatQueryCommentsData(req.query) as TCommentsQuery);

    if (comments) {
        res
            .status(StatusCodeEnum.OK_200)
            .json(comments)
    } else {
        res.status(StatusCodeEnum.NOT_FOUND_404).end()
    }
}