import {TUserDB} from "../db";
import jwt from 'jsonwebtoken';
import {SETTINGS} from "../settings";
import {ObjectId} from "mongodb";

//TODO type for result line 20
type TJWTVerify = {
    userId: string,
    iat: number,
    exp: number
}

export const jwtService = {
    async createJWT(user: TUserDB) {
        return jwt.sign({userId: user._id}, SETTINGS.JWT_SECRET, {expiresIn: SETTINGS.JWT_EXPIRES_TIME});
    },
    async getUserIdByToken(token: string) {
        try {
            //TODO fix any type
            const result: any = jwt.verify(token, SETTINGS.JWT_SECRET);
            return new ObjectId(result.userId)
        } catch (e) {
            return null
        }
    }
}