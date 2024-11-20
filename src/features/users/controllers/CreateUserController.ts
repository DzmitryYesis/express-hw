import {Response} from 'express';
import {RequestWithBody, TInputUser, TOutPutErrorsType, TUser} from "../../../types";
import {HttpStatusCodeEnum} from "../../../constants";
import {usersService} from "../users-service";
import {queryUsersRepository} from "../query-users-repository";

export const CreateUserController = async (req: RequestWithBody<TInputUser>, res: Response<TUser | TOutPutErrorsType>) => {
    const {result, data} = await usersService.createUser(req.body);

    if (result === "SUCCESS") {
        const newUser = await queryUsersRepository.getUserById(data as string);
        res
            .status(HttpStatusCodeEnum.CREATED_201)
            .json(newUser!);
    } else {
        res
            .status(HttpStatusCodeEnum.BAD_REQUEST_400)
            .json(data as TOutPutErrorsType)
    }
}