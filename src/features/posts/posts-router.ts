import {Router} from 'express';
import {
    DeletePostController,
    GetPostByIdController,
    GetPostsController,
    PostNewPostController,
    PutPostByIdController
} from './controllers';
import {authBasicMiddleware, inputCheckErrorsMiddleware, queryFieldsMiddleware} from '../../global-middlewares';
import {
    postBlogIdValidator,
    postContentValidator, posts,
    postShortDescriptionValidator,
    postTitleValidator
} from './middlewares';

export const postsRouter = Router();

postsRouter.get('/',
    ...posts,
    queryFieldsMiddleware,
    GetPostsController
);
postsRouter.post('/',
    authBasicMiddleware,
    postTitleValidator,
    postShortDescriptionValidator,
    postContentValidator,
    postBlogIdValidator,
    inputCheckErrorsMiddleware,
    PostNewPostController)
postsRouter.get('/:id', GetPostByIdController);
postsRouter.put('/:id',
    authBasicMiddleware,
    postTitleValidator,
    postShortDescriptionValidator,
    postContentValidator,
    postBlogIdValidator,
    inputCheckErrorsMiddleware,
    PutPostByIdController);
postsRouter.delete('/:id', authBasicMiddleware, DeletePostController);
