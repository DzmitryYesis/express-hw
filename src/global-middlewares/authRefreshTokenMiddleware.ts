import {NextFunction, Request, Response} from "express";
import {SETTINGS} from "../settings";
import {HttpStatusCodeEnum} from "../constants";
import {usersService} from "../features";

export const authRefreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies[SETTINGS.REFRESH_TOKEN_NAME]) {
        res.status(HttpStatusCodeEnum.NOT_AUTH_401).end();
        return;
    }

    const {result} = await usersService.isRefreshTokenValid(req.cookies[SETTINGS.REFRESH_TOKEN_NAME]);

    if (result === 'REJECT') {
        res.status(HttpStatusCodeEnum.NOT_AUTH_401).end();
    } else {
        next()
    }
}