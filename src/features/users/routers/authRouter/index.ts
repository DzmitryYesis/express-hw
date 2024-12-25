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
import {authController} from "../../../../composition-root";

export const authRouter = Router();

authRouter.get('/me',
    authBearerMiddleware,
    authController.getPersonalData.bind(authController)
)

authRouter.post('/login',
    logRequestMiddleware,
    authLoginOrEmailValidator,
    authPasswordValidator,
    inputCheckErrorsMiddleware,
    authController.login.bind(authController)
);

authRouter.post('/refresh-token',
    authRefreshTokenMiddleware,
    authController.updateTokens.bind(authController)
);

authRouter.post('/logout',
    authRefreshTokenMiddleware,
    authController.logout.bind(authController)
)

authRouter.post('/registration',
    logRequestMiddleware,
    authLoginValidator,
    authPasswordValidator,
    authEmailValidator,
    inputCheckErrorsMiddleware,
    authController.userRegistration.bind(authController)
);

authRouter.post('/registration-confirmation',
    logRequestMiddleware,
    authConfirmationCodeValidator,
    inputCheckErrorsMiddleware,
    authController.confirmRegistration.bind(authController)
);

authRouter.post('/registration-email-resending',
    logRequestMiddleware,
    authEmailValidator,
    inputCheckErrorsMiddleware,
    authController.resendingConfirmCode.bind(authController)
)

authRouter.post('/password-recovery',
    logRequestMiddleware,
    authEmailValidator,
    inputCheckErrorsMiddleware,
    authController.passwordRecovery.bind(authController)
)

authRouter.post('/new-password',
    logRequestMiddleware,
    authPasswordRecoveryCodeValidator,
    authNewPasswordValidator,
    inputCheckErrorsMiddleware,
    authController.newPassword.bind(authController)
)
