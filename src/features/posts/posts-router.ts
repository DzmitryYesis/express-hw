import {Router} from 'express';
import {GetPostByIdController, GetPostsController} from './controllers';

export const postsRouter = Router();

postsRouter.get('/', GetPostsController);
postsRouter.get('/:id', GetPostByIdController);