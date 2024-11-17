import {Router} from "express";
import {authLoginOrEmailValidator, authPasswordValidator} from "./middlewares";
import {authBearerMiddleware, inputCheckErrorsMiddleware} from "../../global-middlewares";
import {AuthController, GetPersonalDataController} from "./controller";

export const authRouter = Router();

authRouter.get('/me',
    authBearerMiddleware,
    GetPersonalDataController
)

authRouter.post('/login',
    authLoginOrEmailValidator,
    authPasswordValidator,
    inputCheckErrorsMiddleware,
    AuthController
);