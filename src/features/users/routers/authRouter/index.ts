import {Router} from "express";
import {
    authConfirmationCodeValidator,
    authEmailValidator,
    authLoginOrEmailValidator,
    authLoginValidator,
    authPasswordValidator
} from "../../middlewares";
import {
    authBearerMiddleware,
    authRefreshTokenMiddleware,
    inputCheckErrorsMiddleware,
    logRequestMiddleware
} from "../../../../global-middlewares";
import {
    LoginController,
    GetPersonalDataController,
    RegistrationUserController,
    RegistrationConfirmationCodeController,
    RegistrationEmailResendingController,
    UpdateTokensController,
    LogoutController
} from "../../controllers";

export const authRouter = Router();

authRouter.get('/me',
    authBearerMiddleware,
    GetPersonalDataController
)

authRouter.post('/login',
    logRequestMiddleware,
    authLoginOrEmailValidator,
    authPasswordValidator,
    inputCheckErrorsMiddleware,
    LoginController
);

authRouter.post('/refresh-token',
    authRefreshTokenMiddleware,
    UpdateTokensController
    );

authRouter.post('/logout',
    authRefreshTokenMiddleware,
    LogoutController
    )

authRouter.post('/registration',
    logRequestMiddleware,
    authLoginValidator,
    authPasswordValidator,
    authEmailValidator,
    inputCheckErrorsMiddleware,
    RegistrationUserController
);

authRouter.post('/registration-confirmation',
    logRequestMiddleware,
    authConfirmationCodeValidator,
    inputCheckErrorsMiddleware,
    RegistrationConfirmationCodeController
);

authRouter.post('/registration-email-resending',
    logRequestMiddleware,
    authEmailValidator,
    inputCheckErrorsMiddleware,
    RegistrationEmailResendingController
)
