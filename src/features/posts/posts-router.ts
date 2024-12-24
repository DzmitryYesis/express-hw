import {Router} from 'express';
import {
    CreateNewCommentForPostByIdController,
    DeletePostController,
    GetCommentsForPostByIdController,
    GetPostByIdController,
    GetPostsController,
    CreatePostController,
    UpdatePostByIdController
} from './controllers';
import {
    authBasicMiddleware,
    authBearerMiddleware,
    checkAccessTokenMiddleware,
    inputCheckErrorsMiddleware,
    queryFieldsMiddleware
} from '../../global-middlewares';
import {
    postBlogIdValidator,
    postContentValidator,
    postIdValidator,
    postsQueriesValidator,
    postShortDescriptionValidator,
    postTitleValidator
} from './middlewares';
import {commentContentValidator, comments} from "../comments";

export const postsRouter = Router();

postsRouter.get('/',
    ...postsQueriesValidator,
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
    CreatePostController)
postsRouter.get('/:id', GetPostByIdController);
postsRouter.get('/:id/comments',
    checkAccessTokenMiddleware,
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
    UpdatePostByIdController);
postsRouter.delete('/:id', authBasicMiddleware, DeletePostController);
