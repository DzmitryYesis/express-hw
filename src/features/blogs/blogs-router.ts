import {Router} from 'express';
import {
    authBasicMiddleware,
    checkAccessTokenMiddleware,
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
import {container} from "../../composition-root";
import {BlogsController} from "./BlogsController";

export const blogsRouter = Router();

const blogsController = container.get(BlogsController);

blogsRouter.get('/',
    ...blogQueriesValidator,
    queryFieldsMiddleware,
    blogsController.getBlogs.bind(blogsController)
);

blogsRouter.get('/:id',
    blogsController.getBlogById.bind(blogsController)
);

blogsRouter.get('/:id/posts',
    checkAccessTokenMiddleware,
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
    checkAccessTokenMiddleware,
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
