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
    inputCheckErrorsMiddleware
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
