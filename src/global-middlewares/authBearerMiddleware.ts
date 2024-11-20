import {NextFunction, Request, Response} from "express";
import {HttpStatusCodeEnum} from "../constants";
import {jwtService} from "../utils";

export const authBearerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.status(HttpStatusCodeEnum.NOT_AUTH_401).end();
        return;
    }

    const token = req.headers.authorization.split(' ')[1];

    const userId = await jwtService.getUserIdByToken(token);
    if (!userId) {
        res.status(HttpStatusCodeEnum.NOT_AUTH_401).end();
        return;
    }

    req.userId = userId.toString();
    next();
}