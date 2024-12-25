import {
    TInputCode,
    TInputLogin,
    TInputNewPassword,
    TInputPasswordRecovery,
    TInputResendEmail,
    TInputUser,
    RequestWithBody,
    TOutPutErrorsType,
    TLoginUser,
    TPersonalData
} from "../../../types";
import {Request, Response} from "express";
import {UsersService} from "../UsersService";
import {HttpStatusCodeEnum} from "../../../constants";
import {SETTINGS} from "../../../settings";
import {QueryUsersRepository} from "../QueryUsersRepository";
import {inject, injectable} from "inversify";

@injectable()
export class AuthController {
    constructor(
        @inject(UsersService) protected usersService: UsersService,
        @inject(QueryUsersRepository) protected queryUsersRepository: QueryUsersRepository,
    ) {}

    async userRegistration(req: RequestWithBody<TInputUser>, res: Response<TOutPutErrorsType>) {
        const {result, data} = await this.usersService.createUser(req.body);

        if (result === "REJECT") {
            res.status(HttpStatusCodeEnum.BAD_REQUEST_400).json(data as TOutPutErrorsType);
        } else {
            res.status(HttpStatusCodeEnum.NO_CONTENT_204).end();
        }
    }

    async confirmRegistration(req: RequestWithBody<TInputCode>, res: Response<TOutPutErrorsType>) {
        const {result, data} = await this.usersService.confirmUserAccount(req.body.code);

        if (result === "REJECT") {
            res.status(HttpStatusCodeEnum.BAD_REQUEST_400).json(data as TOutPutErrorsType)
        } else {
            res.status(HttpStatusCodeEnum.NO_CONTENT_204).end();
        }
    }

    async resendingConfirmCode(req: RequestWithBody<TInputResendEmail>, res: Response<TOutPutErrorsType>) {
        const {result, data} = await this.usersService.resendEmail(req.body.email);

        if (result === "REJECT") {
            res.status(HttpStatusCodeEnum.BAD_REQUEST_400).json(data as TOutPutErrorsType)
        } else {
            res.status(HttpStatusCodeEnum.NO_CONTENT_204).end();
        }
    }

    async login(req: RequestWithBody<TInputLogin>, res: Response<TLoginUser>) {
        const {
            result,
            data
        } = await this.usersService.loginUser(req.body.loginOrEmail, req.body.password, req.ip!, req.headers['user-agent']!);

        if (result === "SUCCESS" && data) {
            res.cookie(SETTINGS.REFRESH_TOKEN_NAME, data.refreshToken, {httpOnly: true, secure: true})
            res.status(HttpStatusCodeEnum.OK_200).send({accessToken: data.accessToken})
        } else {
            res.status(HttpStatusCodeEnum.NOT_AUTH_401).end()
        }
    }

    async getPersonalData(req: Request, res: Response<TPersonalData>) {
        const personalData = await this.queryUsersRepository.getUserPersonalData(req.userId!);

        res
            .status(HttpStatusCodeEnum.OK_200)
            .json(personalData!);
    }

    async updateTokens(req: Request, res: Response<TLoginUser>) {
        const {
            result,
            data
        } = await this.usersService.updateTokens(req.cookies[SETTINGS.REFRESH_TOKEN_NAME].replace('refreshToken=', ''))

        if (result === "SUCCESS" && data) {
            res.cookie(SETTINGS.REFRESH_TOKEN_NAME, data.refreshToken, {httpOnly: true, secure: true})
            res.status(HttpStatusCodeEnum.OK_200).json({accessToken: data.accessToken})
        } else {
            res.status(HttpStatusCodeEnum.NOT_AUTH_401).end()
        }
    }

    async logout(req: Request, res: Response) {
        const {result} = await this.usersService.logoutUser(req.cookies[SETTINGS.REFRESH_TOKEN_NAME].replace('refreshToken=', ''));

        if (result === "SUCCESS") {
            res.status(HttpStatusCodeEnum.NO_CONTENT_204).end()
        } else {
            res.status(HttpStatusCodeEnum.NOT_AUTH_401).end()
        }
    }

    async passwordRecovery(req: RequestWithBody<TInputPasswordRecovery>, res: Response) {
        await this.usersService.passwordRecovery(req.body.email);

        res.status(HttpStatusCodeEnum.NO_CONTENT_204).end();
    }

    async newPassword(req: RequestWithBody<TInputNewPassword>, res: Response<TOutPutErrorsType>) {
        const {result, data} = await this.usersService.newPasswordConfirmation(req.body);

        if (result === "REJECT") {
            res.status(HttpStatusCodeEnum.BAD_REQUEST_400).json(data as TOutPutErrorsType)
        } else {
            res.status(HttpStatusCodeEnum.NO_CONTENT_204).end();
        }
    }
}