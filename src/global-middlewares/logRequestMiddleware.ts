import {Response, Request, NextFunction} from 'express';
import {HttpStatusCodeEnum} from "../constants";
import {logRequestsService} from "../composition-root";

export const logRequestMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip!;
    const url = req.originalUrl;
    const date = new Date();
    const tenSecondsAgo = new Date(date.getTime() - 10 * 1000);

    await logRequestsService.addLogRequest({ip, url, date})

    const {result} = await logRequestsService.countLogRequest({ip, url, date: tenSecondsAgo})

    if (result === 'REJECT') {
        res.status(HttpStatusCodeEnum.TO_MANY_REQUESTS).end();
        return;
    }

    next();
};