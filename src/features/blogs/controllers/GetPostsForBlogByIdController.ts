import {RequestWithParamAndQuery} from "../../../types";
import {TPostsQuery} from "../../types";
import {blogsService} from "../blog-service";
import {formatQueryPostsData} from "../../../utils";
import {StatusCodeEnum} from "../../../constants";
import {Response} from 'express';

export const GetPostsForBlogByIdController = async (req: RequestWithParamAndQuery<{
    id: string
}, TPostsQuery>, res: Response) => {
    const posts = await blogsService.getPostForBlogById(req.params.id, formatQueryPostsData(req.query) as TPostsQuery);

    if (posts) {
        res
            .status(StatusCodeEnum.OK_200)
            .json(posts)
    } else {
        res.status(StatusCodeEnum.NOT_FOUND_404).end()
    }
}