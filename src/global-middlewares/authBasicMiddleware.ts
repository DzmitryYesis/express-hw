import {NextFunction, Response} from 'express';
import {HttpStatusCodeEnum} from '../constants';
import {SETTINGS} from '../settings';
import {CustomRequest} from "../types";

export const authBasicMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
    const auth = req.headers['authorization'] as string;

    if (!auth || !auth.startsWith('Basic ')) {
        res.status(HttpStatusCodeEnum.NOT_AUTH_401).end();
        return;
    }

    const authToken = auth.split(' ')[1];
    if (!authToken) {
        res.status(HttpStatusCodeEnum.NOT_AUTH_401).end();
        return;
    }

    const decodedAuth = Buffer.from(authToken, 'base64').toString('utf8');
    if (decodedAuth !== SETTINGS.AUTH_BASIC) {
        res.status(HttpStatusCodeEnum.NOT_AUTH_401).end();
        return;
    }

    next();
}