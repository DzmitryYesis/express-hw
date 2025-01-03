import {
    TErrorMessage,
    TInputNewPassword,
    TInputUser,
    TLoginUser,
    TOutPutErrorsType,
    TResultServiceObj
} from "../../types";
import bcrypt from "bcrypt";
import {TPasswordRecoveryDB, TSessionsDB, TUserDB} from "../../db";
import {UsersRepository} from "./UsersRepository";
import {createServiceResultObj, jwtService, sendEmailService} from "../../utils";
import {v4 as uuidV4} from "uuid";
import {add} from "date-fns";
import {SessionsRepository} from "./SessionsRepository";
import {SETTINGS} from "../../settings";
import {PasswordRecoveryRepository} from "./PasswordRecoveryRepository";
import {inject, injectable} from "inversify";

@injectable()
export class UsersService {
    constructor(
        @inject(UsersRepository) protected usersRepository: UsersRepository,
        @inject(SessionsRepository) protected sessionsRepository: SessionsRepository,
        @inject(PasswordRecoveryRepository) protected passwordRecoveryRepository: PasswordRecoveryRepository
    ) {}

    async createUser(data: TInputUser, isAdmin = false): Promise<TResultServiceObj<TOutPutErrorsType | string>> {
        const {
            result,
            status,
            data: checkCredentialData
        } = await this.checkLoginAndEmailCredential(data.login, data.email);

        if (result === "REJECT") {
            return createServiceResultObj<TOutPutErrorsType>(result, status, checkCredentialData);
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await this.createHash(data.password, salt)

        const newUser: Omit<TUserDB, '_id'> = {
            accountData: {
                email: data.email,
                login: data.login,
                salt: salt,
                passwordHash: passwordHash,
                createdAt: new Date().toISOString()
            },
            emailConfirmation: {
                confirmationCode: uuidV4(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 3,
                }),
                isConfirmed: isAdmin,
            }
        }

        const insertedId = await this.usersRepository.createUser(newUser);

        if (!isAdmin) {
            const emailHtml = `<h1>Hello ${newUser.accountData.login}</h1> <p><a href="https://some-url.com/confirm-registration?code=${newUser.emailConfirmation.confirmationCode}"></a>Click to confirm your email</p>`

            sendEmailService.sendEmail(data.email, 'Confirm your Email', emailHtml)
                .catch(e => console.log('СARAMBA!!!: ', e));
        }

        return createServiceResultObj<string>("SUCCESS", "CREATED", insertedId);
    }

    async checkLoginAndEmailCredential(login: string, email: string): Promise<TResultServiceObj<TOutPutErrorsType>> {
        const {result: findUserByLoginResult} = await this.findUserByLogin(login);
        const {result: findUserByEmailResult} = await this.findUserByEmail(email);

        const errors: TErrorMessage[] = [];

        if (findUserByLoginResult === "SUCCESS") {
            errors.push({field: 'login', message: 'not unique'})
        }
        if (findUserByEmailResult === "SUCCESS") {
            errors.push({field: 'email', message: 'not unique'})
        }

        if (errors.length > 0) {
            const badRequestResponse: TOutPutErrorsType = {
                errorsMessages: [errors[0]]
            }

            return createServiceResultObj<TOutPutErrorsType>("REJECT", "BAD_REQUEST", badRequestResponse);
        }

        return createServiceResultObj("SUCCESS", "NOT_FOUND");
    }

    async confirmUserAccount(code: string): Promise<TResultServiceObj<TOutPutErrorsType>> {
        const {result, data} = await this.findUserByConfirmationCode(code);

        if (result === "REJECT" ||
            data!.emailConfirmation.confirmationCode !== code ||
            data!.emailConfirmation.expirationDate < new Date() ||
            data!.emailConfirmation.isConfirmed) {
            const badRequestResponse: TOutPutErrorsType = {
                errorsMessages: [{field: 'code', message: 'some problem'}],
            }

            return createServiceResultObj<TOutPutErrorsType>("REJECT", "BAD_REQUEST", badRequestResponse);
        } else {
            await this.usersRepository.confirmUserAccount(data!._id);

            return createServiceResultObj("SUCCESS", "OK")
        }
    }

    async newPasswordConfirmation(data: TInputNewPassword): Promise<TResultServiceObj<TOutPutErrorsType>> {
        const {result, data: passwordRecoveryData} = await this.findPasswordRecoveryCode(data.recoveryCode);

        if (result === 'REJECT' || passwordRecoveryData!.expirationDate < new Date()) {
            const badRequestResponse: TOutPutErrorsType = {
                errorsMessages: [{field: 'recoveryCode', message: 'some problem'}],
            }

            return createServiceResultObj<TOutPutErrorsType>("REJECT", "BAD_REQUEST", badRequestResponse);
        } else {
            const user = await this.usersRepository.findUserById(passwordRecoveryData!.userId.toString());

            const passwordHash = await this.createHash(data.newPassword, user!.accountData.salt)

            await this.usersRepository.updateUserPassword(user!._id, passwordHash);

            await this.passwordRecoveryRepository.deletePasswordRecoveryObj(passwordRecoveryData!._id);

            return createServiceResultObj("SUCCESS", "NO_CONTENT")
        }
    }

    async passwordRecovery(email: string): Promise<TResultServiceObj> {
        const {result, data} = await this.findUserByEmail(email);

        if (result === 'SUCCESS' && data) {
            const passwordRecoveryObj: Omit<TPasswordRecoveryDB, '_id'> = {
                userId: data._id,
                recoveryCode: uuidV4(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 3,
                })
            }

            await this.passwordRecoveryRepository.createPasswordRecovery(passwordRecoveryObj);

            const emailHtml = `<h1>To finish password recovery please follow the link below:</h1> <p><a href="https://some-url.com/password-recovery?recoveryCode=${passwordRecoveryObj.recoveryCode}"></a>Click to confirm your email</p>`

            sendEmailService.sendEmail(data.accountData.email, 'Confirm your Email', emailHtml)
                .catch(e => console.log('СARAMBA!!!: ', e));

            return createServiceResultObj('SUCCESS', 'NO_CONTENT');
        }

        const invalidRecoveryCode = uuidV4();

        const emailHtml = `<h1>To finish password recovery please follow the link below:</h1> <p><a href="https://some-url.com/password-recovery?recoveryCode=${invalidRecoveryCode}"></a>Click to confirm your email</p>`

        sendEmailService.sendEmail(email, 'Confirm your Email', emailHtml)
            .catch(e => console.log('СARAMBA!!!: ', e));

        return createServiceResultObj('SUCCESS', 'NO_CONTENT');
    }

    async resendEmail(email: string): Promise<TResultServiceObj<TOutPutErrorsType>> {
        const {result, data} = await this.findUserByEmail(email);
        if (result === "REJECT" ||
            data!.emailConfirmation.isConfirmed ||
            data!.emailConfirmation.expirationDate < new Date()) {
            const badRequestResponse: TOutPutErrorsType = {
                errorsMessages: [{field: 'email', message: 'some problem'}],
            }

            return createServiceResultObj<TOutPutErrorsType>("REJECT", "BAD_REQUEST", badRequestResponse);
        }

        const newConfirmationCode = uuidV4();

        await this.usersRepository.updateUserConfirmationCode(data!._id, newConfirmationCode);

        const emailHtml = `<h1>Hello ${data!.accountData.login}</h1> <p><a href="https://some-url.com/confirm-registration?code=${newConfirmationCode}"></a>Click to confirm your email</p>`

        sendEmailService.sendEmail(email, 'Confirm your Email', emailHtml)
            .catch(e => console.log('СARAMBA!!!: ', e));

        return createServiceResultObj("SUCCESS", "OK");

    }

    async findSessionByDeviceId(deviceId: string): Promise<TResultServiceObj<TSessionsDB>> {
        const session = await this.sessionsRepository.findSessionByDeviceId(deviceId);

        if (session) {
            return createServiceResultObj<TSessionsDB>("SUCCESS", "OK", session);
        }
        return createServiceResultObj("REJECT", "NOT_FOUND");
    }

    async loginUser(loginOrEmail: string, password: string, ip: string, device: string): Promise<TResultServiceObj<TLoginUser & {
        refreshToken: string
    }>> {
        const user = await this.usersRepository.findUserByLoginOrEmail(loginOrEmail);
        if (!user) {
            return createServiceResultObj("REJECT", "NOT_FOUND");
        }

        const passwordHash = await this.createHash(password, user.accountData.salt);
        if (passwordHash !== user.accountData.passwordHash) {
            return createServiceResultObj("REJECT", "NOT_AUTH");
        }

        const token = await jwtService.createAccessJWT(user._id);
        const deviceId = uuidV4();
        const {refreshToken, iat, exp} = await jwtService.createRefreshJWT(deviceId, user._id.toString());
        const sessionDto: Omit<TSessionsDB, '_id'> = {
            userId: user._id,
            deviceName: device || 'Unknown device',
            ip,
            deviceId,
            exp,
            iat
        };

        await this.sessionsRepository.addSession(sessionDto);

        return createServiceResultObj<TLoginUser & { refreshToken: string }>("SUCCESS", "OK", {
            accessToken: token,
            refreshToken
        });
    }

    async logoutUser(refreshToken: string): Promise<TResultServiceObj> {

        const {deviceId, iat} = await jwtService.decodeRefreshToken(refreshToken.replace('refreshToken=', ''));
        const currentSession = await this.sessionsRepository.findSession(deviceId, iat);

        if (currentSession) {
            await this.sessionsRepository.deleteSessionByDeviceIdAndIat(deviceId, iat);
            return createServiceResultObj("SUCCESS", "NO_CONTENT");
        }

        return createServiceResultObj("REJECT", "NOT_AUTH");
    }

    async updateTokens(refreshToken: string): Promise<TResultServiceObj<TLoginUser & {
        refreshToken: string
    }>> {
        const {deviceId, iat} = await jwtService.decodeRefreshToken(refreshToken);
        const currentSession = await this.sessionsRepository.findSession(deviceId, iat);

        if (currentSession) {
            const newAccessToken = await jwtService.createAccessJWT(currentSession.userId);
            const {
                refreshToken: newRefreshToken,
                iat,
                exp
            } = await jwtService.createRefreshJWT(currentSession.deviceId, currentSession.userId.toString());
            await this.sessionsRepository.updateSessionData({
                ...currentSession,
                iat,
                exp
            })

            return createServiceResultObj<TLoginUser & {
                refreshToken: string
            }>("SUCCESS", "OK", {accessToken: newAccessToken, refreshToken: newRefreshToken})
        }

        return createServiceResultObj("REJECT", "NOT_AUTH");
    }

    async findUserByLogin(login: string): Promise<TResultServiceObj<TUserDB>> {
        const user = await this.usersRepository.findUserByLogin(login);

        if (user) {
            return createServiceResultObj<TUserDB>("SUCCESS", "OK", user);
        }
        return createServiceResultObj("REJECT", "NOT_FOUND");
    }

    async findUserByEmail(email: string): Promise<TResultServiceObj<TUserDB>> {
        const user = await this.usersRepository.findUserByEmail(email);

        if (user) {
            return createServiceResultObj<TUserDB>("SUCCESS", "OK", user);
        }
        return createServiceResultObj("REJECT", "NOT_FOUND");
    }

    async findUserByConfirmationCode(code: string): Promise<TResultServiceObj<TUserDB>> {
        const user = await this.usersRepository.findUserByConfirmationCode(code);

        if (user) {
            return createServiceResultObj<TUserDB>("SUCCESS", "OK", user);
        }
        return createServiceResultObj("REJECT", "NOT_FOUND");
    }

    async findPasswordRecoveryCode(code: string): Promise<TResultServiceObj<TPasswordRecoveryDB>> {
        const passwordRecoveryObj = await this.passwordRecoveryRepository.findPasswordRecoveryCode(code);

        if (passwordRecoveryObj) {
            return createServiceResultObj<TPasswordRecoveryDB>('SUCCESS', 'OK', passwordRecoveryObj);
        }

        return createServiceResultObj("REJECT", "NOT_FOUND");
    }

    async createHash(data: string, salt: string): Promise<string> {
        return await bcrypt.hash(data, salt);
    }

    async isRefreshTokenValid(refreshToken: string): Promise<TResultServiceObj<TSessionsDB>> {
        const {deviceId, iat} = await jwtService.decodeRefreshToken(refreshToken);
        const sessionData = await this.sessionsRepository.findSession(deviceId, iat);
        if (!sessionData) {
            return createServiceResultObj("REJECT", "NOT_AUTH");
        }
        const isRefreshTokenExpired = await jwtService.isTokenExpired(refreshToken, SETTINGS.JWT_REFRESH_TOKEN_SECRET);
        if (isRefreshTokenExpired) {
            await this.sessionsRepository.deleteSessionByDeviceIdAndIat(deviceId, iat);
            return createServiceResultObj("REJECT", "NOT_AUTH");
        }

        return createServiceResultObj<TSessionsDB>("SUCCESS", "OK");
    }

    async deleteUser(id: string): Promise<TResultServiceObj> {
        const isDelete = await this.usersRepository.deleteUser(id);

        if (isDelete) {
            return createServiceResultObj("SUCCESS", "NO_CONTENT")
        } else {
            return createServiceResultObj("REJECT", "NOT_FOUND");
        }
    }

    async deleteDevicesExcludeCurrent(refreshToken: string): Promise<TResultServiceObj> {
        const {userId, deviceId} = await jwtService.decodeRefreshToken(refreshToken);

        const isDelete = await this.sessionsRepository.deleteSessionsExcludeCurrent(deviceId, userId);

        if (isDelete) {
            return createServiceResultObj("SUCCESS", "NO_CONTENT")
        } else {
            return createServiceResultObj("REJECT", "NOT_FOUND");
        }
    }

    async deleteDeviceById(deviceId: string, userId: string): Promise<TResultServiceObj> {
        const {result, status, data} = await this.findSessionByDeviceId(deviceId);

        if (result === "SUCCESS") {
            if (data && data.userId.toString() === userId) {
                await this.sessionsRepository.deleteSessionById(deviceId)

                return createServiceResultObj("SUCCESS", "NO_CONTENT");
            }

            return createServiceResultObj("REJECT", "FORBIDDEN")
        }

        return createServiceResultObj(result, status);
    }


}