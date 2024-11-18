import {Response} from 'express';
import {RequestWithBody, TErrorMessage, TInputUser, TOutPutErrorsType, TUser} from "../../../types";
import {StatusCodeEnum} from "../../../constants";
import {usersService} from "../users-service";
import {queryUsersRepository} from "../query-users-repository";

export const CreateUserController = async (req: RequestWithBody<TInputUser>, res: Response<TUser | TOutPutErrorsType>) => {
    const isLogin = await usersService.findUserByLogin(req.body.login);
    const isEmail = await usersService.findUserByEmail(req.body.email);

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

    const newUserId = await usersService.createUser(req.body);
    const newUser = await queryUsersRepository.getUserById(newUserId);
    res
        .status(StatusCodeEnum.CREATED_201)
        .json(newUser!);
}