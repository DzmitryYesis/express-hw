import {RequestWithParamAndBody, TInputPost, TOutPutErrorsType, TPost} from "../../../types";
import {Response} from "express";
import {blogsService} from "../blog-service";
import {queryBlogsRepository} from "../query-blogs-repository";
import {queryPostsRepository} from "../../posts";
import {StatusCodeEnum} from "../../../constants";

export const CreateNewPostForBlogByIdController = async (req: RequestWithParamAndBody<{
    id: string
}, Omit<TInputPost, 'blogId'>>, res: Response<TPost | TOutPutErrorsType>) => {
    const blog = await queryBlogsRepository.getBlogById(req.params.id);

    if (blog) {
        const newPostId = await blogsService.createPostForBlog(blog, req.body);
        const newPost = await queryPostsRepository.getPostById(newPostId);

        res
            .status(StatusCodeEnum.CREATED_201)
            .json(newPost!)
    } else {
        res.status(StatusCodeEnum.NOT_FOUND_404).end()
    }
}