import {TInputUser, TResponseWithPagination, TUsersQuery} from "../types";
import {TUser, TUserDB} from "../../db";
import {usersRepository} from "./users-repository";
import bcrypt from "bcrypt";

export const usersService = {
    async getUsers(queryData: TUsersQuery): Promise<TResponseWithPagination<TUser[]>> {
        return await usersRepository.getUsers(queryData);
    },
    async getUserById(id: string) {
        return await usersRepository.getUserById(id);
    },
    async createUser(data: TInputUser): Promise<TUser> {

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await this._passwordHash(data.password, salt)

        const newUser: Omit<TUserDB, '_id'> = {
            email: data.email,
            login: data.login,
            salt: salt,
            passwordHash: passwordHash,
            createdAt: new Date().toISOString()
        }

        return await usersRepository.createUser(newUser);
    },
    async deleteUser(id: string): Promise<boolean> {
        return await usersRepository.deleteUser(id);
    },
    async checkCredentials(loginOrEmail: string, password: string): Promise<TUserDB | null> {
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail);

        if (!user) return null;
        const passwordHash = await this._passwordHash(password, user.salt);
        if (passwordHash !== user.passwordHash) return null;

        return user;
    },
    async _findLogin(login: string) {
        return await usersRepository._findLogin(login);
    },
    async _findEmail(email: string) {
        return await usersRepository._findEmail(email);
    },
    async _passwordHash(password: string, salt: string): Promise<string> {
        return await bcrypt.hash(password, salt);
    }
}