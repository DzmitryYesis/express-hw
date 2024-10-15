import {Request, Response, Router} from 'express';
import {TPost} from '../db';
import {StatusCodeEnum} from '../constans/index';
import {postsRepository} from '../repositories/index';

export const postsRouter = Router();

const postsController = {
    getPosts: (req: Request, res: Response<TPost[]>) => {
        res
            .status(StatusCodeEnum.OK_200)
            .json(postsRepository.getPosts())
    }
}

postsRouter.get('/', postsController.getPosts)