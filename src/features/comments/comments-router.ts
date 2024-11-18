import {Router} from "express";
import {
    DeleteCommentByIdController,
    GetCommentsByIdController,
    UpdateCommentByIdController
} from "./controllers";
import {
    authBearerMiddleware,
    inputCheckErrorsMiddleware
} from "../../global-middlewares";
import {commentContentValidator} from "./middlewares";

export const commentsRouter = Router();

commentsRouter.get('/:id',
    GetCommentsByIdController
)

commentsRouter.put('/:id',
    authBearerMiddleware,
    commentContentValidator,
    inputCheckErrorsMiddleware,
    UpdateCommentByIdController
);
commentsRouter.delete('/:id',
    authBearerMiddleware,
    DeleteCommentByIdController
)