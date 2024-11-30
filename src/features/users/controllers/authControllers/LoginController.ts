import {Response} from 'express';
import {RequestWithBody, TLoginUser, TInputLogin} from "../../../../types";
import {usersService} from "../../users-service";
import {HttpStatusCodeEnum} from "../../../../constants";
import {SETTINGS} from "../../../../settings";

export const LoginController = async (req: RequestWithBody<TInputLogin>, res: Response<TLoginUser>) => {

    const {
        result,
        data
    } = await usersService.loginUser(req.body.loginOrEmail, req.body.password, req.headers['user-agent']!);

    if (result === "SUCCESS" && data) {
        res.cookie(SETTINGS.REFRESH_TOKEN_NAME, data.refreshToken, {httpOnly: true, secure: true})
        res.status(HttpStatusCodeEnum.OK_200).send({accessToken: data.accessToken})
    } else {
        res.status(HttpStatusCodeEnum.NOT_AUTH_401).end()
    }
}