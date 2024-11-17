import {Response} from 'express';
import {RequestWithBody} from "../../../types/requestTypes";
import {TErrorMessage, TInputUser, TOutPutErrorsType} from "../../types";
import {TUser} from "../../../db";
import {usersService} from "../users-service";
import {StatusCodeEnum} from "../../../constants";

export const PostUserController = async (req: RequestWithBody<TInputUser>, res: Response<TUser | TOutPutErrorsType>) => {
    const isLogin = await usersService._findLogin(req.body.login);
    const isEmail = await usersService._findEmail(req.body.email);

    const errors: TErrorMessage[] = [];

    if (isLogin) {
        errors.push({field: 'login', message: 'login not unique error message'})
    }
    if (isEmail) {
        errors.push({field: 'email', message: 'email not unique error message'})
    }

    if (errors.length > 0) {
        const badRequestResponse: TOutPutErrorsType = {
            errorsMessages: [errors[0]]
        }

        res
            .status(StatusCodeEnum.BAD_REQUEST_400)
            .json(badRequestResponse)
        return
    }

    const newUser = await usersService.createUser(req.body);
    res
        .status(StatusCodeEnum.CREATED_201)
        .json(newUser);
}