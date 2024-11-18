import {Response} from 'express';
import {StatusCodeEnum} from '../../../constants';
import {queryBlogsRepository} from "../query-blogs-repository";
import {RequestWithQuery, TBlog, TBlogsQuery, TResponseWithPagination} from "../../../types";
import {formatQueryBlogsData} from "../../../utils";

export const GetBlogsController = async (req: RequestWithQuery<TBlogsQuery>, res: Response<TResponseWithPagination<TBlog[]>>) => {
    const blogs = await queryBlogsRepository.getBlogs(formatQueryBlogsData(req.query) as TBlogsQuery) as TResponseWithPagination<TBlog[]>

    res
        .status(StatusCodeEnum.OK_200)
        .json(blogs)
}