import {NextFunction, Request, Response} from 'express';
import {StatusCodeEnum} from '../constants';
import {SETTINGS} from '../settings';

export const authBasicMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers['authorization'] as string;

    if (!auth || !auth.startsWith('Basic ')) {
        res.status(StatusCodeEnum.NOT_AUTH_401).end();
        return;
    }

    const authToken = auth.split(' ')[1];
    if (!authToken) {
        res.status(StatusCodeEnum.NOT_AUTH_401).end();
        return;
    }

    const decodedAuth = Buffer.from(authToken, 'base64').toString('utf8');
    if (decodedAuth !== SETTINGS.AUTH_BASIC) {
        res.status(StatusCodeEnum.NOT_AUTH_401).end();
        return;
    }

    next();
}