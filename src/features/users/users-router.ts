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
    CreateUserController
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
    CreateUserController
);

usersRouter.delete('/:id', authBasicMiddleware, DeleteUserController)