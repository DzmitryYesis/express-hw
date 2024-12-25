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
import {container} from "../../../../composition-root";
import {UsersController} from "../../controllers";

export const userRouter = Router();

const usersController = container.get(UsersController);

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