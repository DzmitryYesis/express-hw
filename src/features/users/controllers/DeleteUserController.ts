import {RequestWithParam} from "../../../types";
import {Response} from "express";
import {HttpStatusCodeEnum} from "../../../constants";
import {usersService} from "../users-service";

export const DeleteUserController = async (req: RequestWithParam<{
    id: string
}>, res: Response) => {
    const {result} = await usersService.deleteUser(req.params.id);

    if (result === "SUCCESS") {
        res.status(HttpStatusCodeEnum.NO_CONTENT_204).end()
    } else {
        res.status(HttpStatusCodeEnum.NOT_FOUND_404).end()
    }
}