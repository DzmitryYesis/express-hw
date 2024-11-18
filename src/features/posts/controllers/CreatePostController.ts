import {TInputPost, TOutPutErrorsType, TPost, RequestWithBody} from '../../../types';
import {Response} from 'express';
import {StatusCodeEnum} from '../../../constants';
import {queryBlogsRepository} from "../../blogs";
import {postsService} from "../posts-service";
import {queryPostsRepository} from "../query-posts-repository";

export const CreatePostController = async (req: RequestWithBody<TInputPost>, res: Response<TPost | TOutPutErrorsType>) => {
    const blog = await queryBlogsRepository.getBlogById(req.body.blogId);

    if (blog) {
        const newPostId = await postsService.createPost(req.body, blog);
        const newPost = await queryPostsRepository.getPostById(newPostId);

        res
            .status(StatusCodeEnum.CREATED_201)
            .json(newPost!)
    } else {
        throw new Error('Oops!')
    }
}