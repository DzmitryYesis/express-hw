import {Response, Request, NextFunction} from 'express';
import {logRequestService} from "../features";
import {HttpStatusCodeEnum} from "../constants";

export const logRequestMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip!;
    const url = req.originalUrl;
    const date = new Date();
    const tenSecondsAgo = new Date(date.getTime() - 10 * 1000);

    await logRequestService.addLogRequest({ip, url, date})

    const {result} = await logRequestService.countLogRequest({ip, url, date: tenSecondsAgo})

    if (result === 'REJECT') {
        res.status(HttpStatusCodeEnum.TO_MANY_REQUESTS).end();
        return;
    }

    next();
};