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
import {usersController} from "../../../../composition-root";

export const userRouter = Router();

userRouter.get('/',
    authBasicMiddleware,
    ...usersQueriesValidator,
    queryFieldsMiddleware,
    usersController.getUsers.bind(usersController)
);

userRouter.post('/',
    authBasicMiddleware,
    userLoginValidator,
    userPasswordValidator,
    userEmailValidator,
    inputCheckErrorsMiddleware,
    usersController.createUser.bind(usersController)
);

userRouter.delete('/:id',
    authBasicMiddleware,
    usersController.deleteUser.bind(usersController)
)