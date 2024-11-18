import {Response} from 'express';
import {RequestWithBody, TInputAuth} from "../../../types";
import {usersService} from "../../users";
import {StatusCodeEnum} from "../../../constants";
import {jwtService} from "../../../utils";

export const AuthController = async (req: RequestWithBody<TInputAuth>, res: Response<{ accessToken: string }>) => {
    const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password);

    if (user) {
        const token = await jwtService.createJWT(user);

        res.status(StatusCodeEnum.OK_200).send({
            accessToken: token
        })
    } else {
        res.status(StatusCodeEnum.NOT_AUTH_401).end()
    }
}