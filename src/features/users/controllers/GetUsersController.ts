import {HttpStatusCodeEnum} from "../../../constants";
import {formatQueryUsersData} from "../../../utils";
import {Response} from 'express';
import {
    TUsersQuery,
    TUser,
    TResponseWithPagination,
    RequestWithQuery
} from "../../../types";
import {queryUsersRepository} from "../query-users-repository";

export const GetUsersController = async (req: RequestWithQuery<TUsersQuery>, res: Response<TResponseWithPagination<TUser[]>>) => {
    const users = await queryUsersRepository.getUsers(formatQueryUsersData(req.query) as TUsersQuery) as TResponseWithPagination<TUser[]>;

    res
        .status(HttpStatusCodeEnum.OK_200)
        .json(users);
}