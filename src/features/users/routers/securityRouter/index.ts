import {Router} from "express";
import {authRefreshTokenMiddleware} from "../../../../global-middlewares";
import {container} from "../../../../composition-root";
import {SecurityController} from "../../controllers";

export const securityRouter = Router();

const securityController = container.get(SecurityController);

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