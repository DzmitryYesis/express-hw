import {NextFunction, Request, Response} from "express";
import {SETTINGS} from "../settings";
import {HttpStatusCodeEnum} from "../constants";
import {usersService} from "../features";
import {jwtService} from "../utils";

export const authRefreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies[SETTINGS.REFRESH_TOKEN_NAME]) {
        res.status(HttpStatusCodeEnum.NOT_AUTH_401).end();
        return;
    }

    const refreshToken = req.cookies[SETTINGS.REFRESH_TOKEN_NAME].replace('refreshToken=', '');

    const isValidJWTFormat = await jwtService.isValidJWTFormat(refreshToken);

    if (!isValidJWTFormat) {
        res.status(HttpStatusCodeEnum.NOT_AUTH_401).end();
        return;
    }

    const {result} = await usersService.isRefreshTokenValid(refreshToken);

    if (result === 'REJECT') {
        res.status(HttpStatusCodeEnum.NOT_AUTH_401).end();
    } else {
        const {userId} = await jwtService.decodeRefreshToken(refreshToken);
        req.userId = userId;
        next()
    }
}