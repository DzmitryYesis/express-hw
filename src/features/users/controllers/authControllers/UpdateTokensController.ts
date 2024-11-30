import {Response, Request} from "express";
import {TLoginUser} from "../../../../types/viewModels";
import {usersService} from "../../users-service";
import {HttpStatusCodeEnum} from "../../../../constants";
import {SETTINGS} from "../../../../settings";

export const UpdateTokensController = async (req: Request, res: Response<TLoginUser>) => {
    const {result, data} = await usersService.updateTokens(req.cookies[SETTINGS.REFRESH_TOKEN_NAME])

    if (result === "SUCCESS" && data) {
        res.cookie(SETTINGS.REFRESH_TOKEN_NAME, data.refreshToken, {httpOnly: true, secure: true})
        res.status(HttpStatusCodeEnum.OK_200).json({accessToken: data.accessToken})
    } else {
        res.status(HttpStatusCodeEnum.NOT_AUTH_401).end()
    }
};