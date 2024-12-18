import {Response, Request} from 'express';
import {usersService} from "../../users-service";
import {SETTINGS} from "../../../../settings";
import {HttpStatusCodeEnum} from "../../../../constants";

export const DeleteDevicesExcludeCurrentController = async (req: Request, res: Response) => {
    const {result} = await usersService.deleteDevicesExcludeCurrent(req.cookies[SETTINGS.REFRESH_TOKEN_NAME].replace('refreshToken=', ''));

    if (result === "SUCCESS") {
        res.status(HttpStatusCodeEnum.NO_CONTENT_204).end()
    } else {
        res.status(HttpStatusCodeEnum.NOT_FOUND_404).end()
    }
}