import {Response} from 'express';
import {RequestWithBody, TLoginUser, TInputLogin} from "../../../types";
import {usersService} from "../../users";
import {HttpStatusCodeEnum} from "../../../constants";

export const LoginController = async (req: RequestWithBody<TInputLogin>, res: Response<TLoginUser>) => {
    const {result, data} = await usersService.loginUser(req.body.loginOrEmail, req.body.password);

    if (result === "SUCCESS") {
        res.status(HttpStatusCodeEnum.OK_200).send(data)
    } else {
        res.status(HttpStatusCodeEnum.NOT_AUTH_401).end()
    }
}