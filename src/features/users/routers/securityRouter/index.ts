import {Router} from "express";
import {authRefreshTokenMiddleware} from "../../../../global-middlewares";
import {securityController} from "../../../../composition-root";

export const securityRouter = Router();

securityRouter.get('/',
    authRefreshTokenMiddleware,
    securityController.getDevices.bind(securityController)
);

securityRouter.delete('/',
    authRefreshTokenMiddleware,
    securityController.deleteDevicesExcludeCurrent.bind(securityController)
)

securityRouter.delete('/:deviceId',
    authRefreshTokenMiddleware,
    securityController.deleteDevice.bind(securityController)
)