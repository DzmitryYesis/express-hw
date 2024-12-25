import {Router} from 'express';
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
import {blogsController} from "../../composition-root";

export const blogsRouter = Router();

blogsRouter.get('/',
    ...blogQueriesValidator,
    queryFieldsMiddleware,
    blogsController.getBlogs.bind(blogsController)
);

blogsRouter.get('/:id',
    blogsController.getBlogById.bind(blogsController)
);

blogsRouter.get('/:id/posts',
    blogIdValidator,
    ...postsQueriesValidator,
    queryFieldsMiddleware,
    blogsController.getPostForBlog.bind(blogsController)
)

blogsRouter.post('/',
    authBasicMiddleware,
    blogNameValidator,
    blogDescriptionValidator,
    blogWebsiteUrlValidator,
    inputCheckErrorsMiddleware,
    blogsController.createBlog.bind(blogsController)
)

blogsRouter.post('/:id/posts',
    authBasicMiddleware,
    blogIdValidator,
    postTitleValidator,
    postShortDescriptionValidator,
    postContentValidator,
    inputCheckErrorsMiddleware,
    blogsController.createPostForBlog.bind(blogsController)
)

blogsRouter.put('/:id',
    authBasicMiddleware,
    blogNameValidator,
    blogDescriptionValidator,
    blogWebsiteUrlValidator,
    inputCheckErrorsMiddleware,
    blogsController.updateBlog.bind(blogsController)
);

blogsRouter.delete('/:id',
    authBasicMiddleware,
    blogsController.deleteBlog.bind(blogsController)
);
