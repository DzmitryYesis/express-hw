import {Router} from "express";
import {authRefreshTokenMiddleware} from "../../../../global-middlewares";
import {
    DeleteDeviceByIdController,
    DeleteDevicesExcludeCurrentController,
    GetDevicesController
} from "../../controllers";

export const securityRouter = Router();

securityRouter.get('/',
    authRefreshTokenMiddleware,
    GetDevicesController
);

securityRouter.delete('/',
    authRefreshTokenMiddleware,
    DeleteDevicesExcludeCurrentController
)

securityRouter.delete('/:deviceId',
    authRefreshTokenMiddleware,
    DeleteDeviceByIdController
)