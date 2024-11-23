import {RequestWithBody, TOutPutErrorsType, TInputUser} from "../../../../types";
import {usersService} from "../../users-service";
import {HttpStatusCodeEnum} from "../../../../constants";
import {Response} from 'express';

export const RegistrationUserController = async (req: RequestWithBody<TInputUser>, res: Response<TOutPutErrorsType>) => {
    const {result, data} = await usersService.createUser(req.body);

    if (result === "REJECT") {
        res.status(HttpStatusCodeEnum.BAD_REQUEST_400).json(data as TOutPutErrorsType);
    } else {
        res.status(HttpStatusCodeEnum.NO_CONTENT_204).end();
    }
}