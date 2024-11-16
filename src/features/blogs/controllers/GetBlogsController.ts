import {Response} from 'express';
import {TBlog} from '../../../db';
import {StatusCodeEnum} from '../../../constants';
import {blogsService} from "../blog-service";
import {RequestWithQuery} from "../../../types";
import {TBlogsQuery, TResponseWithPagination} from "../../types";
import {formatQueryBlogsData} from "../../../utils";

export const GetBlogsController = async (req: RequestWithQuery<TBlogsQuery>, res: Response) => {
    const blogs = await blogsService.getBlogs(formatQueryBlogsData(req.query) as TBlogsQuery) as TResponseWithPagination<TBlog[]>

    res
        .status(StatusCodeEnum.OK_200)
        .json(blogs)
}