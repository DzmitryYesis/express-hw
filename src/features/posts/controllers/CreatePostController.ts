import {TInputPost, TOutPutErrorsType, TPost, RequestWithBody} from '../../../types';
import {Response} from 'express';
import {postsService} from "../posts-service";
import {queryPostsRepository} from "../query-posts-repository";
import {HttpStatusCodeEnum} from "../../../constants";

export const CreatePostController = async (req: RequestWithBody<TInputPost>, res: Response<TPost | TOutPutErrorsType>) => {
    const {result, data} = await postsService.createPost(req.body);

    if (result === "SUCCESS" && data) {
        const newPost = await queryPostsRepository.getPostById(data);

        res.status(HttpStatusCodeEnum.CREATED_201).json(newPost!)
    } else {
        //optional
        res.status(HttpStatusCodeEnum.NOT_FOUND_404).end()
    }
}