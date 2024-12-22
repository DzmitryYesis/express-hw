import {Response} from 'express';
import {usersService} from "../../users-service";
import {RequestWithBody, TInputPasswordRecovery} from "../../../../types";
import {HttpStatusCodeEnum} from "../../../../constants";

export const PasswordRecoveryController = async (req: RequestWithBody<TInputPasswordRecovery>, res: Response) => {
    await usersService.passwordRecovery(req.body.email);

    res.status(HttpStatusCodeEnum.NO_CONTENT_204).end();
}