import {Router} from "express";
import {authLoginOrEmailValidator, authPasswordValidator} from "./middlewares";
import {inputCheckErrorsMiddleware} from "../../global-middlewares";
import {AuthController} from "./controller";

export const authRouter = Router();

authRouter.use('/login',
    authLoginOrEmailValidator,
    authPasswordValidator,
    inputCheckErrorsMiddleware,
    AuthController
);