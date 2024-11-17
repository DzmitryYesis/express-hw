import {Router} from 'express';
import {
    CreateNewCommentForPostByIdController,
    DeletePostController,
    GetCommentsForPostByIdController,
    GetPostByIdController,
    GetPostsController,
    PostNewPostController,
    PutPostByIdController
} from './controllers';
import {
    authBasicMiddleware,
    authBearerMiddleware,
    inputCheckErrorsMiddleware,
    queryFieldsMiddleware
} from '../../global-middlewares';
import {
    postBlogIdValidator,
    postContentValidator,
    postIdValidator,
    posts,
    postShortDescriptionValidator,
    postTitleValidator
} from './middlewares';
import {commentContentValidator, comments} from "../comments";

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
postsRouter.get('/:id/comments',
    postIdValidator,
    ...comments,
    queryFieldsMiddleware,
    GetCommentsForPostByIdController
);
postsRouter.post('/:id/comments',
    authBearerMiddleware,
    postIdValidator,
    commentContentValidator,
    inputCheckErrorsMiddleware,
    CreateNewCommentForPostByIdController
);
postsRouter.put('/:id',
    authBasicMiddleware,
    postTitleValidator,
    postShortDescriptionValidator,
    postContentValidator,
    postBlogIdValidator,
    inputCheckErrorsMiddleware,
    PutPostByIdController);
postsRouter.delete('/:id', authBasicMiddleware, DeletePostController);
