import {Router} from "express";
import {
    authBasicMiddleware,
    inputCheckErrorsMiddleware,
    queryFieldsMiddleware
} from "../../global-middlewares";
import {
    userEmailValidator,
    userLoginValidator,
    userPasswordValidator,
    users
} from "./middlewares";
import {
    DeleteUserController,
    GetUsersController,
    PostUserController
} from "./controllers";

export const usersRouter = Router();

usersRouter.get('/',
    ...users,
    queryFieldsMiddleware,
    GetUsersController
);

usersRouter.post('/',
    authBasicMiddleware,
    userLoginValidator,
    userPasswordValidator,
    userEmailValidator,
    inputCheckErrorsMiddleware,
    PostUserController
);

usersRouter.delete('/:id', authBasicMiddleware, DeleteUserController)