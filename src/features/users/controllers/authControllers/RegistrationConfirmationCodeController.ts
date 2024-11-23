import {RequestWithBody, TInputCode, TOutPutErrorsType} from "../../../../types";
import {Response} from 'express';
import {usersService} from "../../users-service";
import {HttpStatusCodeEnum} from "../../../../constants";

export const RegistrationConfirmationCodeController = async (req: RequestWithBody<TInputCode>, res: Response<TOutPutErrorsType>) => {
    const {result, data} = await usersService.confirmUserAccount(req.body.code);

    if (result === "REJECT") {
        res.status(HttpStatusCodeEnum.BAD_REQUEST_400).json(data as TOutPutErrorsType)
    } else {
        res.status(HttpStatusCodeEnum.NO_CONTENT_204).end();
    }
};