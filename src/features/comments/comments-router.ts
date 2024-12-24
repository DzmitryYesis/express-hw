import {Router} from "express";
import {
    DeleteCommentByIdController,
    GetCommentsByIdController,
    LikeForCommentController,
    UpdateCommentByIdController
} from "./controllers";
import {
    authBearerMiddleware,
    checkAccessTokenMiddleware,
    inputCheckErrorsMiddleware
} from "../../global-middlewares";
import {
    commentContentValidator,
    commentLikeValidator
} from "./middlewares";

export const commentsRouter = Router();

commentsRouter.get('/:id',
    checkAccessTokenMiddleware,
    GetCommentsByIdController
)

commentsRouter.put('/:id',
    authBearerMiddleware,
    commentContentValidator,
    inputCheckErrorsMiddleware,
    UpdateCommentByIdController
);

commentsRouter.put('/:id/like-status',
    authBearerMiddleware,
    commentLikeValidator,
    inputCheckErrorsMiddleware,
    LikeForCommentController
)

commentsRouter.delete('/:id',
    authBearerMiddleware,
    DeleteCommentByIdController
)