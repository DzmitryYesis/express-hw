import {Router} from "express";
import {
    authBearerMiddleware,
    checkAccessTokenMiddleware,
    inputCheckErrorsMiddleware
} from "../../global-middlewares";
import {
    commentContentValidator,
    commentLikeValidator
} from "./middlewares";
import {container} from "../../composition-root";
import {CommentsController} from "./CommentsController";

export const commentsRouter = Router();

const commentsController = container.get(CommentsController);

commentsRouter.get('/:id',
    checkAccessTokenMiddleware,
    commentsController.getCommentById.bind(commentsController)
)

commentsRouter.put('/:id',
    authBearerMiddleware,
    commentContentValidator,
    inputCheckErrorsMiddleware,
    commentsController.updateComment.bind(commentsController)
);

commentsRouter.put('/:id/like-status',
    authBearerMiddleware,
    commentLikeValidator,
    inputCheckErrorsMiddleware,
    commentsController.likeForComment.bind(commentsController)
)

commentsRouter.delete('/:id',
    authBearerMiddleware,
    commentsController.deleteComment.bind(commentsController)
)