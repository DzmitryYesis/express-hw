import {Response} from "express";
import {RequestWithBody, TInputResendEmail, TOutPutErrorsType} from "../../../../types";
import {usersService} from "../../users-service";
import {HttpStatusCodeEnum} from "../../../../constants";

export const RegistrationEmailResendingController = async (req: RequestWithBody<TInputResendEmail>, res: Response<TOutPutErrorsType>) => {
    const {result, data} = await usersService.resendEmail(req.body.email);

    if (result === "REJECT") {
        res.status(HttpStatusCodeEnum.BAD_REQUEST_400).json(data as TOutPutErrorsType)
    } else {
        res.status(HttpStatusCodeEnum.NO_CONTENT_204).end();
    }
};