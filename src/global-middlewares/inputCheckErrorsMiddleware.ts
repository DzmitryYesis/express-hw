import {NextFunction, Response} from 'express';
import {validationResult} from 'express-validator';
import {CustomRequest, TOutPutErrorsType} from '../types';
import {HttpStatusCodeEnum} from '../constants';

export const inputCheckErrorsMiddleware = (req: CustomRequest, res: Response<TOutPutErrorsType>, next: NextFunction) => {
    const e = validationResult(req)
    if (!e.isEmpty()) {
        const eArray = e.array({onlyFirstError: true}) as { path: string, msg: string }[]

        res
            .status(HttpStatusCodeEnum.BAD_REQUEST_400)
            .json({
                errorsMessages: eArray.map(x => ({field: x.path, message: x.msg}))
            })
        return
    }

    next()
}