import {Response} from 'express';
import {RequestWithBody, TInputNewPassword, TOutPutErrorsType} from "../../../../types";
import {HttpStatusCodeEnum} from "../../../../constants";
import {usersService} from "../../users-service";

export const NewPasswordController = async (req: RequestWithBody<TInputNewPassword>, res: Response<TOutPutErrorsType>) => {
    const {result, data} = await usersService.newPasswordConfirmation(req.body);

    if (result === "REJECT") {
        res.status(HttpStatusCodeEnum.BAD_REQUEST_400).json(data as TOutPutErrorsType)
    } else {
        res.status(HttpStatusCodeEnum.NO_CONTENT_204).end();
    }
}