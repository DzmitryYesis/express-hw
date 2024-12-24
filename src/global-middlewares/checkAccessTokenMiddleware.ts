import {NextFunction, Request, Response} from "express";
import {jwtService} from "../utils";

export const checkAccessTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        req.userId = null;
    } else {
        const token = req.headers.authorization.split(' ')[1];

        const userId = await jwtService.getUserIdByToken(token);

        if (!userId) {
            req.userId = null;
        } else {
            req.userId = userId!.toString();
        }
    }

    next()
}