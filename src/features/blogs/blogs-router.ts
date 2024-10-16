import {Router} from 'express';
import {GetBlogByIdController, GetBlogsController} from './controllers';

export const blogsRouter = Router();

blogsRouter.get('/', GetBlogsController);
blogsRouter.get('/:id', GetBlogByIdController);