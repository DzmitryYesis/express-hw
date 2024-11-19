import {TInputUser} from "../../types";
import bcrypt from "bcrypt";
import {TUserDB} from "../../db";
import {usersRepository} from "./users-repository";

export const usersService = {
    async createUser(data: TInputUser): Promise<string> {

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await this.createPasswordHash(data.password, salt)

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
        const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail);

        if (!user) return null;
        const passwordHash = await this.createPasswordHash(password, user.salt);
        if (passwordHash !== user.passwordHash) return null;

        return user;
    },
    async findUserByLogin(login: string): Promise<TUserDB | null> {
        return await usersRepository.findUserByLogin(login);
    },
    async findUserByEmail(email: string): Promise<TUserDB | null> {
        return await usersRepository.findUserByEmail(email);
    },
    async findUserById(id: string): Promise<TUserDB | null> {
        return await usersRepository.findUserById(id);
    },
    async createPasswordHash(password: string, salt: string): Promise<string> {
        return await bcrypt.hash(password, salt);
    }
}