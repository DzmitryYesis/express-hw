import {Router} from 'express';
import {
    DeleteBlogController,
    GetBlogByIdController,
    GetBlogsController,
    PostBlogController,
    PutBlogByIdController
} from './controllers';
import {authBasicMiddleware, inputCheckErrorsMiddleware} from '../../global-middlewares';
import {
    blogDescriptionValidator,
    blogNameValidator,
    blogWebsiteUrlValidator
} from './middlewares/index';

export const blogsRouter = Router();

blogsRouter.get('/', GetBlogsController);
blogsRouter.post('/',
    authBasicMiddleware,
    blogNameValidator,
    blogDescriptionValidator,
    blogWebsiteUrlValidator,
    inputCheckErrorsMiddleware,
    PostBlogController)
blogsRouter.get('/:id', GetBlogByIdController);
blogsRouter.put('/:id',
    authBasicMiddleware,
    blogNameValidator,
    blogDescriptionValidator,
    blogWebsiteUrlValidator,
    inputCheckErrorsMiddleware,
    PutBlogByIdController);
blogsRouter.delete('/:id', authBasicMiddleware, DeleteBlogController);
