import {NextFunction, Response, Request} from 'express';
import {validationResult} from 'express-validator';
import {TOutPutErrorsType} from '../features/blogs/types';
import {StatusCodeEnum} from '../constants';

export const inputCheckErrorsMiddleware = (req: Request, res: Response<TOutPutErrorsType>, next: NextFunction) => {
    const e = validationResult(req)
    if (!e.isEmpty()) {
        const eArray = e.array({onlyFirstError: true}) as { path: string, msg: string }[]

        res
            .status(StatusCodeEnum.BAD_REQUEST_400)
            .json({
                errorsMessages: eArray.map(x => ({field: x.path, message: x.msg}))
            })
        return
    }

    next()
}