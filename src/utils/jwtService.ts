import {TUserDB} from "../db";
import jwt from 'jsonwebtoken';
import {SETTINGS} from "../settings";
import {ObjectId} from "mongodb";

type TJWTVerify = {
    userId: string,
    iat: number,
    exp: number
}

export const jwtService = {
    async createAccessJWT(userId: ObjectId): Promise<string> {
        return jwt.sign({userId: userId}, SETTINGS.JWT_ACCESS_TOKEN_SECRET, {expiresIn: SETTINGS.JWT_ACCESS_TOKEN_EXPIRES_TIME});
    },
    async createRefreshJWT(): Promise<string> {
        return jwt.sign({}, SETTINGS.JWT_REFRESH_TOKEN_SECRET, {expiresIn: SETTINGS.JWT_REFRESH_TOKEN_EXPIRES_TIME});
    },
    async getUserIdByToken(token: string) {
        try {
            const result = jwt.verify(token, SETTINGS.JWT_ACCESS_TOKEN_SECRET) as TJWTVerify;

            return new ObjectId(result.userId)
        } catch (e) {
            return null
        }
    },
    async isTokenExpired (token: string, key: string) {
        try {
            jwt.verify(token, key);
            return false
        } catch (e) {
            return true
        }
    },
}