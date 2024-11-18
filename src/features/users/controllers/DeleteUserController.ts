import {RequestWithParam} from "../../../types";
import {Response} from "express";
import {StatusCodeEnum} from "../../../constants";
import {usersService} from "../users-service";

export const DeleteUserController = async (req: RequestWithParam<{
    id: string
}>, res: Response) => {
    const isDeleteUser = await usersService.deleteUser(req.params.id);

    if (isDeleteUser) {
        res.status(StatusCodeEnum.NO_CONTENT_204).end()
    } else {
        res.status(StatusCodeEnum.NOT_FOUND_404).end()
    }
}