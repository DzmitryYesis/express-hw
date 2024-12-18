import {Response, Request} from 'express';
import {usersService} from "../../users-service";
import {SETTINGS} from "../../../../settings";
import {HttpStatusCodeEnum} from "../../../../constants";

export const DeleteDeviceByIdController = async (req: Request, res: Response) => {
    const {
        result,
        status
    } = await usersService.deleteDeviceById(req.params.id, req.cookies[SETTINGS.REFRESH_TOKEN_NAME].replace('refreshToken=', ''));

    if (result === "SUCCESS") {
        res.status(HttpStatusCodeEnum.NO_CONTENT_204).end();
    } else {
        if (status === "FORBIDDEN") {
            res.status(HttpStatusCodeEnum.FORBIDDEN_403).end();
        } else {
            res.status(HttpStatusCodeEnum.NOT_FOUND_404).end();
        }
    }
}