import {Router} from "express";
import {
    authConfirmationCodeValidator,
    authEmailValidator,
    authLoginOrEmailValidator,
    authLoginValidator,
    authPasswordValidator
} from "../../middlewares";
import {authBearerMiddleware, inputCheckErrorsMiddleware} from "../../../../global-middlewares";
import {
    LoginController,
    GetPersonalDataController,
    RegistrationUserController,
    RegistrationConfirmationCodeController, RegistrationEmailResendingController
} from "../../controllers";

export const authRouter = Router();

authRouter.get('/me',
    authBearerMiddleware,
    GetPersonalDataController
)

authRouter.post('/login',
    authLoginOrEmailValidator,
    authPasswordValidator,
    inputCheckErrorsMiddleware,
    LoginController
);

authRouter.post('/registration',
    authLoginValidator,
    authPasswordValidator,
    authEmailValidator,
    inputCheckErrorsMiddleware,
    RegistrationUserController
);

authRouter.post('/registration-confirmation',
    authConfirmationCodeValidator,
    inputCheckErrorsMiddleware,
    RegistrationConfirmationCodeController
);

authRouter.post('/registration-email-resending',
    authEmailValidator,
    inputCheckErrorsMiddleware,
    RegistrationEmailResendingController
)
