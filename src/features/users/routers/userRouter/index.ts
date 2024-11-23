import {Router} from "express";
import {
    authBasicMiddleware,
    inputCheckErrorsMiddleware,
    queryFieldsMiddleware
} from "../../../../global-middlewares";
import {
    userEmailValidator,
    userLoginValidator,
    userPasswordValidator,
    usersQueriesValidator
} from "../../middlewares";
import {
    DeleteUserController,
    GetUsersController,
    CreateUserController
} from "../../controllers";

export const userRouter = Router();

userRouter.get('/',
    authBasicMiddleware,
    ...usersQueriesValidator,
    queryFieldsMiddleware,
    GetUsersController
);

userRouter.post('/',
    authBasicMiddleware,
    userLoginValidator,
    userPasswordValidator,
    userEmailValidator,
    inputCheckErrorsMiddleware,
    CreateUserController
);

userRouter.delete('/:id', authBasicMiddleware, DeleteUserController)