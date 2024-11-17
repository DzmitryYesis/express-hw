import {RequestWithQuery} from "../../../types/requestTypes";
import {TResponseWithPagination, TUsersQuery} from "../../types";
import {TUser} from "../../../db";
import {StatusCodeEnum} from "../../../constants";
import {formatQueryUsersData} from "../../../utils";
import {Response} from 'express';
import {usersService} from "../users-service";

export const GetUsersController = async (req: RequestWithQuery<TUsersQuery>, res: Response) => {
    const users = await usersService.getUsers(formatQueryUsersData(req.query) as TUsersQuery) as TResponseWithPagination<TUser[]>;

    res
        .status(StatusCodeEnum.OK_200)
        .json(users);
}