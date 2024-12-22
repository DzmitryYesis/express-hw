import {Router} from "express";
import {
    authConfirmationCodeValidator,
    authEmailValidator,
    authLoginOrEmailValidator,
    authLoginValidator,
    authNewPasswordValidator,
    authPasswordRecoveryCodeValidator,
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
    LogoutController, PasswordRecoveryController, NewPasswordController
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

authRouter.post('/password-recovery',
    logRequestMiddleware,
    authEmailValidator,
    inputCheckErrorsMiddleware,
    PasswordRecoveryController
)

authRouter.post('/new-password',
    logRequestMiddleware,
    authPasswordRecoveryCodeValidator,
    authNewPasswordValidator,
    inputCheckErrorsMiddleware,
    NewPasswordController
    )
