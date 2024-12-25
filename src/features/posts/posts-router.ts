import {Router} from 'express';
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
import {container} from "../../composition-root";
import {PostsController} from "./PostsController";

export const postsRouter = Router();

const postsController = container.get(PostsController);

postsRouter.get('/',
    checkAccessTokenMiddleware,
    ...postsQueriesValidator,
    queryFieldsMiddleware,
    postsController.getPosts.bind(postsController)
);

postsRouter.get('/:id',
    checkAccessTokenMiddleware,
    postsController.getPostById.bind(postsController)
);

postsRouter.get('/:id/comments',
    checkAccessTokenMiddleware,
    postIdValidator,
    ...comments,
    queryFieldsMiddleware,
    postsController.getCommentForPost.bind(postsController)
);

postsRouter.post('/',
    checkAccessTokenMiddleware,
    authBasicMiddleware,
    postTitleValidator,
    postShortDescriptionValidator,
    postContentValidator,
    postBlogIdValidator,
    inputCheckErrorsMiddleware,
    postsController.createPost.bind(postsController)
)

postsRouter.post('/:id/comments',
    authBearerMiddleware,
    postIdValidator,
    commentContentValidator,
    inputCheckErrorsMiddleware,
    postsController.createCommentForPost.bind(postsController)
);

postsRouter.put('/:id',
    authBasicMiddleware,
    postTitleValidator,
    postShortDescriptionValidator,
    postContentValidator,
    postBlogIdValidator,
    inputCheckErrorsMiddleware,
    postsController.updatePost.bind(postsController)
);

postsRouter.delete('/:id',
    authBasicMiddleware,
    postsController.deletePost.bind(postsController)
);
