import {Router} from 'express';
import {
    DeleteBlogController,
    GetBlogByIdController,
    GetBlogsController,
    PostBlogController,
    PutBlogByIdController,
    GetPostsForBlogByIdController, PostNewPostForBlogByIdController
} from './controllers';
import {authBasicMiddleware, inputCheckErrorsMiddleware, queryFieldsMiddleware} from '../../global-middlewares';
import {
    blogDescriptionValidator, blogIdValidator,
    blogNameValidator, blogs,
    blogWebsiteUrlValidator
} from './middlewares';
import {postContentValidator, posts, postShortDescriptionValidator, postTitleValidator} from "../posts/middlewares";

export const blogsRouter = Router();

blogsRouter.get('/',
    ...blogs,
    queryFieldsMiddleware,
    GetBlogsController
);
blogsRouter.post('/',
    authBasicMiddleware,
    blogNameValidator,
    blogDescriptionValidator,
    blogWebsiteUrlValidator,
    inputCheckErrorsMiddleware,
    PostBlogController)
blogsRouter.get('/:id', GetBlogByIdController);
blogsRouter.get('/:id/posts',
    blogIdValidator,
    ...posts,
    queryFieldsMiddleware,
    inputCheckErrorsMiddleware,
    GetPostsForBlogByIdController
    )
blogsRouter.post('/:id/posts',
    authBasicMiddleware,
    blogIdValidator,
    postTitleValidator,
    postShortDescriptionValidator,
    postContentValidator,
    inputCheckErrorsMiddleware,
    PostNewPostForBlogByIdController,
)
blogsRouter.put('/:id',
    authBasicMiddleware,
    blogNameValidator,
    blogDescriptionValidator,
    blogWebsiteUrlValidator,
    inputCheckErrorsMiddleware,
    PutBlogByIdController);
blogsRouter.delete('/:id', authBasicMiddleware, DeleteBlogController);
