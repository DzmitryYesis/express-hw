import {
    TOutPutErrorsType,
    TInputUser,
    TUser,
    TResponseWithPagination,
    TUsersQuery,
    RequestWithBody,
    RequestWithParam,
    RequestWithQuery
} from "../../../types";
import {Response} from "express";
import {QueryUsersRepository} from "../QueryUsersRepository";
import {formatQueryUsersData} from "../../../utils";
import {HttpStatusCodeEnum} from "../../../constants";
import {UsersService} from "../UsersService";
import {inject, injectable} from "inversify";

@injectable()
export class UsersController {
    constructor(
        @inject(QueryUsersRepository) protected queryUsersRepository: QueryUsersRepository,
        @inject(UsersService) protected usersService: UsersService,
    ) {}

    async getUsers(req: RequestWithQuery<TUsersQuery>, res: Response<TResponseWithPagination<TUser[]>>) {
        const users = await this.queryUsersRepository.getUsers(formatQueryUsersData(req.query));

        res
            .status(HttpStatusCodeEnum.OK_200)
            .json(users);
    }

    async createUser(req: RequestWithBody<TInputUser>, res: Response<TUser | TOutPutErrorsType>) {
        const {result, data} = await this.usersService.createUser(req.body, true);

        if (result === "SUCCESS") {
            const newUser = await this.queryUsersRepository.getUserById(data as string);
            res
                .status(HttpStatusCodeEnum.CREATED_201)
                .json(newUser!);
        } else {
            res
                .status(HttpStatusCodeEnum.BAD_REQUEST_400)
                .json(data as TOutPutErrorsType)
        }
    }

    async deleteUser(req: RequestWithParam<{
        id: string
    }>, res: Response) {
        const {result} = await this.usersService.deleteUser(req.params.id);

        if (result === "SUCCESS") {
            res.status(HttpStatusCodeEnum.NO_CONTENT_204).end()
        } else {
            res.status(HttpStatusCodeEnum.NOT_FOUND_404).end()
        }
    }
}