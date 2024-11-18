import {Router} from 'express';
import {
    DeleteBlogController,
    GetBlogByIdController,
    GetBlogsController,
    CreateBlogController,
    UpdateBlogByIdController,
    GetPostsForBlogByIdController,
    CreateNewPostForBlogByIdController
} from './controllers';
import {
    authBasicMiddleware,
    inputCheckErrorsMiddleware,
    queryFieldsMiddleware
} from '../../global-middlewares';
import {
    blogDescriptionValidator,
    blogIdValidator,
    blogNameValidator,
    blogQueriesValidator,
    blogWebsiteUrlValidator
} from './middlewares';
import {
    postContentValidator,
    postsQueriesValidator,
    postShortDescriptionValidator,
    postTitleValidator
} from "../posts/middlewares";

export const blogsRouter = Router();

blogsRouter.get('/',
    ...blogQueriesValidator,
    queryFieldsMiddleware,
    GetBlogsController
);
blogsRouter.post('/',
    authBasicMiddleware,
    blogNameValidator,
    blogDescriptionValidator,
    blogWebsiteUrlValidator,
    inputCheckErrorsMiddleware,
    CreateBlogController)
blogsRouter.get('/:id', GetBlogByIdController);
blogsRouter.get('/:id/posts',
    blogIdValidator,
    ...postsQueriesValidator,
    queryFieldsMiddleware,
    GetPostsForBlogByIdController
)
blogsRouter.post('/:id/posts',
    authBasicMiddleware,
    blogIdValidator,
    postTitleValidator,
    postShortDescriptionValidator,
    postContentValidator,
    inputCheckErrorsMiddleware,
    CreateNewPostForBlogByIdController,
)
blogsRouter.put('/:id',
    authBasicMiddleware,
    blogNameValidator,
    blogDescriptionValidator,
    blogWebsiteUrlValidator,
    inputCheckErrorsMiddleware,
    UpdateBlogByIdController);
blogsRouter.delete('/:id', authBasicMiddleware, DeleteBlogController);
