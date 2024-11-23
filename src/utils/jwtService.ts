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
    async createJWT(user: TUserDB): Promise<string> {
        return jwt.sign({userId: user._id}, SETTINGS.JWT_SECRET, {expiresIn: SETTINGS.JWT_EXPIRES_TIME});
    },
    async getUserIdByToken(token: string) {
        try {
            const result = jwt.verify(token, SETTINGS.JWT_SECRET) as TJWTVerify;

            return new ObjectId(result.userId)
        } catch (e) {
            return null
        }
    }
}