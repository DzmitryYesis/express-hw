import {TErrorMessage, TInputUser, TLoginUser, TOutPutErrorsType, TResultServiceObj} from "../../types";
import bcrypt from "bcrypt";
import {TUserDB} from "../../db";
import {usersRepository} from "./users-repository";
import {createServiceResultObj, jwtService} from "../../utils";

export const usersService = {
    async createUser(data: TInputUser): Promise<TResultServiceObj<TOutPutErrorsType | string>> {
        const {result: findUserByLoginResult} = await this.findUserByLogin(data.login);
        const {result: findUserByEmailResult} = await this.findUserByEmail(data.email);

        const errors: TErrorMessage[] = [];

        if (findUserByLoginResult === "SUCCESS") {
            errors.push({field: 'login', message: 'login not unique error message'})
        }
        if (findUserByEmailResult === "SUCCESS") {
            errors.push({field: 'email', message: 'email not unique error message'})
        }

        if (errors.length > 0) {
            const badRequestResponse: TOutPutErrorsType = {
                errorsMessages: [errors[0]]
            }

            return createServiceResultObj<TOutPutErrorsType>("REJECT", "BAD_REQUEST", badRequestResponse)
        }


        const salt = await bcrypt.genSalt(10);
        const passwordHash = await this.createPasswordHash(data.password, salt)

        const newUser: Omit<TUserDB, '_id'> = {
            email: data.email,
            login: data.login,
            salt: salt,
            passwordHash: passwordHash,
            createdAt: new Date().toISOString()
        }

        const insertedId = await usersRepository.createUser(newUser);

        return createServiceResultObj<string>("SUCCESS", "CREATED", insertedId);
    },
    async deleteUser(id: string): Promise<TResultServiceObj> {
        const isDelete = await usersRepository.deleteUser(id);

        if (isDelete) {
            return createServiceResultObj("SUCCESS", "NO_CONTENT")
        } else {
            return createServiceResultObj("REJECT", "NOT_FOUND");
        }
    },
    async loginUser(loginOrEmail: string, password: string): Promise<TResultServiceObj<TLoginUser>> {
        const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail);
        if (!user) {
            return createServiceResultObj("REJECT", "NOT_FOUND");
        }

        const passwordHash = await this.createPasswordHash(password, user.salt);
        if (passwordHash !== user.passwordHash) {
            return createServiceResultObj("REJECT", "NOT_AUTH");
        }

        const token = await jwtService.createJWT(user);

        return createServiceResultObj<TLoginUser>("SUCCESS", "OK", {accessToken: token});
    },
    async findUserByLogin(login: string): Promise<TResultServiceObj<TUserDB>> {
        const user = await usersRepository.findUserByLogin(login);

        if (user) {
            return createServiceResultObj<TUserDB>("SUCCESS", "OK", user);
        }
        return createServiceResultObj("REJECT", "NOT_FOUND");
    },
    async findUserByEmail(email: string): Promise<TResultServiceObj<TUserDB>> {
        const user = await usersRepository.findUserByEmail(email);

        if (user) {
            return createServiceResultObj<TUserDB>("SUCCESS", "OK", user);
        }
        return createServiceResultObj("REJECT", "NOT_FOUND");
    },
    async createPasswordHash(password: string, salt: string): Promise<string> {
        return await bcrypt.hash(password, salt);
    }
}