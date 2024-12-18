import {Response, Request} from "express";
import {usersService} from "../../users-service";
import {HttpStatusCodeEnum} from "../../../../constants";
import {SETTINGS} from "../../../../settings";

export const LogoutController = async (req: Request, res: Response) => {
    const {result} = await usersService.logoutUser(req.cookies[SETTINGS.REFRESH_TOKEN_NAME].replace('refreshToken=', ''));

    if (result === "SUCCESS") {
        res.status(HttpStatusCodeEnum.NO_CONTENT_204).end()
    } else {
        res.status(HttpStatusCodeEnum.NOT_AUTH_401).end()
    }
}