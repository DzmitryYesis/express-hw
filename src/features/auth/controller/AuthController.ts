import {Response} from 'express';
import {RequestWithBody} from "../../../types";
import {TInputAuth} from "../../types";
import {usersService} from "../../users/users-service";
import {StatusCodeEnum} from "../../../constants";

export const AuthController = async (req: RequestWithBody<TInputAuth>, res: Response) => {
    const isUserExist = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password);

    if (isUserExist) {
        res.status(StatusCodeEnum.NO_CONTENT_204).end()
    } else {
        res.status(StatusCodeEnum.NOT_AUTH_401).end()
    }
}